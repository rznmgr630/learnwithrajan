import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_14_DETAIL = {
  overview: [
    "Backpressure is the mechanism by which a slow consumer signals a fast producer to slow down — without it, the consumer's buffer fills, memory exhausts, and the system crashes. Message queues are the most common implementation: they decouple producers from consumers and absorb traffic spikes by buffering work.",
    "Day 14 covers backpressure mechanics, the major queue patterns (work queue, pub/sub, fan-out), reliability guarantees (at-least-once vs exactly-once), and practical queue design with Redis Streams, RabbitMQ, and AWS SQS.",
  ],
  sections: [
    {
      title: "Backpressure — why it matters",
      blocks: [
        {
          type: "diagram",
          id: "queue-backpressure",
        },
        {
          type: "paragraph",
          text: "Without backpressure, a fast producer sending to a slow consumer causes unbounded buffer growth. Eventually memory runs out — the classic out-of-memory crash under load. Backpressure propagates the slowness upstream: 'I'm full, stop sending for now.'",
        },
        {
          type: "table",
          headers: ["Mechanism", "How it works", "Example"],
          rows: [
            [
              "Blocking / flow control",
              "Producer blocks (waits) when consumer buffer is full",
              "TCP send buffer full → sender blocks on write()",
            ],
            [
              "Bounded queue with rejection",
              "Queue has a max depth; new items are rejected (or dropped) when full",
              "HTTP 429 Too Many Requests when work queue is full",
            ],
            [
              "Rate limiting producer",
              "Producer is throttled to match consumer throughput",
              "Token bucket on API gateway limits ingest rate",
            ],
            [
              "Reactive Streams",
              "Consumer signals demand; producer only sends N items at a time",
              "Node.js streams, RxJS, Akka Streams",
            ],
          ],
        },
      ],
    },
    {
      title: "Message queue patterns",
      blocks: [
        {
          type: "diagram",
          id: "producer-consumer",
        },
        {
          type: "table",
          caption: "Choose the pattern that matches your fan-out and ordering requirements.",
          headers: ["Pattern", "How", "Use when"],
          rows: [
            [
              "Work queue (competing consumers)",
              "One queue, N consumers — each message processed by exactly one worker",
              "Background jobs: image resize, email send, report generation",
            ],
            [
              "Pub/Sub (fan-out)",
              "One message published → delivered to all subscribers",
              "Event broadcast: order.created → email service, inventory service, analytics",
            ],
            [
              "Topic routing",
              "Messages carry a routing key; consumers subscribe to specific topics",
              "Different services handle different event types: user.* vs order.*",
            ],
            [
              "Dead letter queue (DLQ)",
              "Messages that fail repeatedly are moved to a separate queue for inspection",
              "Any production queue — prevents poison messages from blocking the queue",
            ],
          ],
        },
      ],
    },
    {
      title: "Delivery guarantees",
      blocks: [
        {
          type: "table",
          caption: "Exactly-once is expensive — design for at-least-once + idempotent consumers.",
          headers: ["Guarantee", "Meaning", "Cost"],
          rows: [
            [
              "At-most-once",
              "Message delivered 0 or 1 times — fire and forget, no retry",
              "Lowest overhead; messages may be lost on crash",
            ],
            [
              "At-least-once",
              "Message delivered 1 or more times — retried until acknowledged",
              "Consumer must be idempotent (safe to process duplicates)",
            ],
            [
              "Exactly-once",
              "Message delivered exactly once even on failure",
              "Expensive — requires distributed transaction or idempotency key + dedup store",
            ],
          ],
        },
        {
          type: "code",
          title: "Idempotent consumer — dedup by message ID",
          code: `async function processOrderCreated(msg: Message) {
  const messageId = msg.headers["x-message-id"];

  // Check if already processed
  const already = await redis.set(
    \`processed:\${messageId\}\`,
    "1",
    "NX",   // only set if not exists
    "EX",   // expire
    86400   // 24 hours
  );
  if (!already) {
    console.log("Duplicate message, skipping:", messageId);
    return; // acknowledge without reprocessing
  }

  // Process the message
  await fulfillOrder(msg.body.orderId);
}`,
        },
      ],
    },
    {
      title: "Redis Streams",
      blocks: [
        {
          type: "code",
          title: "Redis Streams — producer + consumer group",
          code: `import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// --- PRODUCER ---
// XADD appends a message; * = auto-generate ID (timestamp-sequence)
await redis.xAdd("orders:stream", "*", {
  order_id: "ord_123",
  user_id:  "usr_456",
  total:    "99.00",
});

// --- CONSUMER ---
// Create consumer group (once)
await redis.xGroupCreate("orders:stream", "fulfilment-group", "0", { MKSTREAM: true });

// Worker loop
while (true) {
  // XREADGROUP: claim up to 10 unprocessed messages
  const results = await redis.xReadGroup(
    "fulfilment-group",
    "worker-1",               // consumer name
    { key: "orders:stream", id: ">" },  // > = only new messages
    { COUNT: 10, BLOCK: 5000 }          // block up to 5s waiting
  );

  for (const { id, message } of results?.[0]?.messages ?? []) {
    await processOrder(message);
    await redis.xAck("orders:stream", "fulfilment-group", id);  // mark done
  }
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "XPENDING: inspect messages claimed by a worker but not yet ACKed — use to detect stalled workers.",
            "XCLAIM: reassign a pending message to a different worker after a timeout (dead worker recovery).",
            "XLEN: queue depth — alert when backlog grows beyond expected levels.",
            "Consumer group allows multiple workers to share the stream; each message is delivered to exactly one worker in the group.",
          ],
        },
      ],
    },
    {
      title: "AWS SQS + SNS patterns",
      blocks: [
        {
          type: "table",
          headers: ["Service", "Type", "Best for"],
          rows: [
            ["SQS Standard", "Work queue — at-least-once, unordered", "Background jobs; high throughput; order doesn't matter"],
            ["SQS FIFO", "Work queue — exactly-once, ordered per group", "Payment processing, order state machines; lower throughput (3000 msg/s)"],
            ["SNS", "Pub/Sub fan-out", "Broadcast one event to multiple SQS queues, Lambda, HTTP endpoints"],
            ["SNS → SQS fan-out", "Hybrid: broadcast + queue buffering", "order.created SNS topic fans out to fulfilment-queue, notification-queue, analytics-queue"],
          ],
        },
        {
          type: "code",
          title: "SQS consumer with visibility timeout (Node.js AWS SDK v3)",
          code: `import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });
const QUEUE_URL = process.env.SQS_QUEUE_URL!;

async function pollQueue() {
  while (true) {
    const { Messages = [] } = await sqs.send(new ReceiveMessageCommand({
      QueueUrl:            QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds:     20,       // long polling — saves cost
      VisibilityTimeout:   60,       // other workers won't see this message for 60s
    }));

    for (const msg of Messages) {
      try {
        await processJob(JSON.parse(msg.Body!));
        // Delete only on success
        await sqs.send(new DeleteMessageCommand({ QueueUrl: QUEUE_URL, ReceiptHandle: msg.ReceiptHandle! }));
      } catch (err) {
        // Don't delete — message reappears after VisibilityTimeout; DLQ after maxReceiveCount
        console.error("Job failed, will retry:", err);
      }
    }
  }
}`,
        },
      ],
    },
    {
      title: "Queue design — production checklist",
      blocks: [
        {
          type: "table",
          headers: ["Concern", "Implementation"],
          rows: [
            [
              "Dead letter queue",
              "Route messages that fail N times to a DLQ for inspection. Never let poison messages block the queue indefinitely.",
            ],
            [
              "Visibility timeout",
              "Set to 2–3× your expected processing time. Too short → messages redelivered mid-process. Too long → slow failure recovery.",
            ],
            [
              "Retry with exponential backoff",
              "Retry after 1s, 2s, 4s, 8s... with jitter. Avoid stampeding all workers retrying simultaneously.",
            ],
            [
              "Queue depth alerting",
              "Alert when ApproximateNumberOfMessages exceeds a threshold — indicates consumers are falling behind.",
            ],
            [
              "Message size",
              "Keep payloads small — store large data in S3/blob storage, put the reference (key) in the message.",
            ],
            [
              "Idempotency",
              "Every consumer must handle duplicates safely. Use a dedup key stored in Redis or DB with TTL equal to message retention.",
            ],
          ],
        },
      ],
    },
    {
      title: "Node.js stream backpressure",
      blocks: [
        {
          type: "paragraph",
          text: "Node.js Readable and Writable streams implement backpressure natively. When a Writable's internal buffer exceeds highWaterMark, write() returns false — the signal to pause the upstream source. Resume is signalled via the drain event.",
        },
        {
          type: "code",
          title: "Correct stream piping with backpressure",
          code: `import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { createGzip } from "zlib";

// pipeline() handles backpressure and error propagation automatically
await pipeline(
  createReadStream("large-file.csv"),
  createGzip(),
  createWriteStream("large-file.csv.gz")
);

// Manual approach — if pipeline doesn't fit
const readable = getReadableSource();
const writable = getWritableDestination();

readable.on("data", (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) readable.pause();            // backpressure: stop reading
});
writable.on("drain", () => readable.resume()); // buffer cleared, resume`,
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is backpressure and why does it matter in distributed systems?",
      tag: "Backpressure",
      answer: [
        "Backpressure is the mechanism by which a slow consumer signals a fast producer to reduce its sending rate. Without it, the consumer's in-memory buffer grows without bound — eventually causing an out-of-memory crash or dropped messages.",
        "In distributed systems, backpressure appears at every layer: TCP send buffers, HTTP request queues, message queue depth, and database connection pool exhaustion. Designing for backpressure means every ingestion point has a finite capacity and a defined behaviour when full (reject, drop, or block the caller).",
      ].join("\n\n"),
      callout: "No backpressure = the fastest producer always wins, eventually crashing the consumer.",
    },
    {
      question: "What is the difference between at-least-once and exactly-once delivery?",
      tag: "Delivery guarantees",
      answer: [
        "At-least-once: the queue retries delivery until the consumer acknowledges the message. On a consumer crash before ACK, the message reappears. The consumer must be idempotent — processing the same message twice must produce the same result.",
        "Exactly-once: the queue guarantees the message is delivered and processed exactly once. This requires coordinated state between the queue and the consumer — typically a transactional outbox pattern or a dedup store. Expensive and complex. Most production systems use at-least-once + idempotent consumers.",
      ].join("\n\n"),
    },
    {
      question: "What is a dead letter queue and when should messages go there?",
      tag: "Dead letter queue",
      answer: [
        "A DLQ is a separate queue where messages are moved after failing to process N times (configurable maxReceiveCount in SQS, x-dead-letter-exchange in RabbitMQ). It prevents a poison message — one that always fails due to a bug or bad data — from blocking the main queue indefinitely.",
        "Always attach a DLQ to production queues. Alert when DLQ depth grows — it means consumers are encountering errors the retry policy cannot recover from. Inspect the DLQ messages to identify the root cause.",
      ].join("\n\n"),
      callout: "No DLQ = one bad message blocks your entire queue. Always configure one.",
    },
    {
      question: "What is the visibility timeout in SQS and how should you set it?",
      tag: "SQS",
      answer: [
        "When an SQS consumer receives a message, it becomes invisible to other workers for the visibility timeout duration. If the consumer ACKs (deletes) the message before the timeout, the message is gone. If the consumer crashes, the timeout expires and the message reappears for retry.",
        "Set the visibility timeout to 2–3× your expected processing time. Too short: if a job takes 30s but the timeout is 10s, the message reappears mid-process and two workers process it simultaneously. Too long: if a worker crashes, messages are unavailable to other workers for a long time.",
      ].join("\n\n"),
    },
    {
      question: "What is long polling in SQS and why does it matter for cost?",
      tag: "SQS",
      answer: [
        "By default, SQS ReceiveMessage returns immediately even if no messages are available (short polling) — wasting API calls and cost. Long polling (WaitTimeSeconds=20) holds the connection open for up to 20 seconds, returning as soon as a message arrives.",
        "Long polling reduces empty receive calls by up to 20×, directly cutting SQS API costs and CPU usage in polling workers. Always use WaitTimeSeconds > 0 in production.",
      ].join("\n\n"),
    },
    {
      question: "How does an idempotent consumer handle duplicate messages?",
      tag: "Idempotency",
      answer: [
        "An idempotent consumer records a unique message ID after successful processing (in Redis, DynamoDB, or a DB table). Before processing, it checks if the ID has been seen. If yes, it acknowledges the message without reprocessing.",
        "The dedup record's TTL should equal or exceed the queue's message retention period. Common implementation: Redis SET messageId 1 NX EX 86400 — only sets if not exists, expires in 24h. If SET returns nil, the message was already processed.",
      ].join("\n\n"),
    },
    {
      question: "When should I use SNS + SQS fan-out vs a direct SQS queue?",
      tag: "Queue patterns",
      answer: [
        "Use a direct SQS queue when there is exactly one consumer type. Use SNS + SQS fan-out when multiple independent services need to react to the same event: an order.created SNS topic fans out to a fulfilment queue, a notification queue, and an analytics queue — each service processes independently at its own pace.",
        "The fan-out pattern decouples producers from consumers. The producer publishes one event; SNS handles delivery to all subscribed queues. Adding a new consumer requires only subscribing a new SQS queue to the SNS topic — no producer change.",
      ].join("\n\n"),
    },
    {
      question: "How does Node.js backpressure work with streams?",
      tag: "Node.js streams",
      answer: [
        "Node.js Writable streams have an internal buffer with a highWaterMark (default 16 KB for byte streams). When write() returns false, the buffer is full — the producer must pause. When the buffer drains, the drain event fires — the producer resumes.",
        "The pipe() and pipeline() APIs handle this automatically. When writing manual stream code, always check write() return value and listen for drain — ignoring backpressure causes unbounded memory growth and eventual crash.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Implement a Redis Streams producer that enqueues jobs and a worker that processes them with consumer groups — test what happens when a worker crashes mid-job.",
    "Add a dead letter queue to an SQS setup: configure maxReceiveCount=3, attach a DLQ, and write a monitor that alerts when DLQ depth > 0.",
    "Demonstrate backpressure in a Node.js Readable → Transform → Writable pipeline: throttle the writable and observe the readable pausing.",
  ],
} satisfies RoadmapDayDetail;
