import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_58_LESSONS: LessonDay = {
  day: 58,
  title: "Message Queues & Background Processing with BullMQ",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-58-lesson-1",
      title: "Queue Architecture: Producers, Consumers, Workers & Jobs",
      durationMinutes: 24,
      explanation: `<b>Why Message Queues Matter in Production</b>

In synchronous REST APIs, every client HTTP request expects an immediate response. If a user registers an account and your controller synchronously sends a welcome email, generates a PDF invoice, and resizes a profile avatar before returning a response, the request latency explodes (e.g. 5–10 seconds). Worse, if the SMTP email server times out, the entire account creation request fails!

To deliver sub-100ms API response times and protect server stability, heavy or failure-prone tasks are offloaded to an asynchronous **Message Queue**.

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│                    API Layer (HTTP)                     │
│  User registers -> HTTP 201 Created (<50ms response)    │
└───────────────────────────┬─────────────────────────────┘
                            │
               PRODUCER: Enqueues Job ("user-welcome")
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Message Queue State (Redis)                │
│         Holds pending, active, and failed jobs          │
└───────────────────────────┬─────────────────────────────┘
                            │
               WORKER: Consumes and executes Job
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Background Processing                   │
│      Sends Email via SMTP / Processes Heavy PDF         │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>The Four Core Pillars of Queue Architecture</b>

1. <b>Job</b>: A serializable payload containing data and metadata required to execute a background task (e.g., \`{ userId: "usr_123", template: "welcome" }\`).
2. <b>Producer</b>: The NestJS API service or controller that creates jobs and pushes them onto a queue channel in Redis.
3. <b>Queue</b>: The persistent data structure backed by Redis (using Redis Hashes, Streams, or Sorted Sets) that holds jobs across states (\`waiting\`, \`active\`, \`completed\`, \`failed\`, \`delayed\`).
4. <b>Worker / Consumer</b>: An isolated background process that listens to the queue, picks up waiting jobs sequentially or concurrently, executes the business logic, and reports the status back to Redis.

<b>Decoupling HTTP from Heavy Processing</b>

By isolating queue workers from API web servers, your HTTP controllers focus exclusively on request validation and fast database mutations. Background workers can run on separate dedicated worker servers or auto-scale independently based on queue backlogs.`,
      diagram: `                    ASYNCHRONOUS QUEUE PIPELINE
                               │
               POST /api/v1/users (Registration)
                               │
                               ▼
                    ┌─────────────────────┐
                    │ UsersController     │
                    └──────────┬──────────┘
                               │
               Enqueues Job ("send-welcome-email")
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Redis Queue (BullMQ)│ ◄── Returns HTTP 201 immediately!
                    └──────────┬──────────┘
                               │
                Worker Picks Up Job Async
                               │
                               ▼
                    ┌─────────────────────┐
                    │ EmailWorkerProcess  │
                    └─────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/email/dto/send-email-job.dto.ts
export interface SendEmailJobPayload {
  userId: string;
  recipientEmail: string;
  template: 'WELCOME' | 'PASSWORD_RESET' | 'INVOICE';
  metadata?: Record<string, any>;
}

// src/email/email-producer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendEmailJobPayload } from './dto/send-email-job.dto';

export const EMAIL_QUEUE_NAME = 'email-queue';

@Injectable()
export class EmailProducerService {
  private readonly logger = new Logger(EmailProducerService.name);

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME)
    private readonly emailQueue: Queue<SendEmailJobPayload>,
  ) {}

  /**
   * Enqueues a background email job and returns immediately to the HTTP thread.
   */
  async queueWelcomeEmail(userId: string, email: string): Promise<string> {
    const payload: SendEmailJobPayload = {
      userId,
      recipientEmail: email,
      template: 'WELCOME',
    };

    // Push job to Redis queue with explicit job options
    const job = await this.emailQueue.add('send-welcome-email', payload, {
      priority: 1, // Higher priority execution
      removeOnComplete: true, // Keep Redis memory lean
      removeOnFail: 100, // Retain last 100 failed jobs for auditing
    });

    this.logger.log(\`Enqueued email job #\${job.id} for user \${userId}\`);
    return job.id!;
  }
}`,
      },
      keyTakeaways: [
        "Message queues decouple synchronous HTTP API calls from heavy or unpredictable background processes.",
        "Producers push job payloads to Redis queues and return HTTP responses immediately without waiting for execution.",
        "Workers consume jobs asynchronously from Redis in isolated background threads or processes.",
        "Background workers can be scaled horizontally independently from web-facing API containers.",
      ],
      commonMistakes: [
        "<b>Executing heavy or blocking I/O synchronously inside HTTP controllers.</b> Performing PDF rendering, video encoding, or third-party webhooks inline causes API timeouts.",
        "<b>Passing non-serializable objects inside job payloads.</b> Job payloads are serialized to JSON strings in Redis; pass plain strings, numbers, or simple objects (like \`userId\`) rather than complex class instances or functions.",
      ],
      quiz: [
        {
          question: "What is the primary operational benefit of using a message queue for sending welcome emails upon user registration?",
          options: [
            "It eliminates the need for an SMTP email provider",
            "It decouples HTTP response latency from email delivery time and ensures email server downtime doesn't fail registration requests",
            "It automatically converts HTML emails into PDF documents",
            "It encrypts user passwords before saving them to PostgreSQL"
          ],
          correctIndex: 1,
          explanation: "Queues allow the HTTP controller to return a fast HTTP 201 response immediately, executing the email dispatch asynchronously in the background."
        }
      ]
    },
    {
      id: "day-58-lesson-2",
      title: "NestJS BullMQ Integration and Consumer Workers",
      durationMinutes: 25,
      explanation: `<b>Enterprise Background Processing with NestJS & BullMQ</b>

While Bull was historically the standard Redis queue package for Node.js, **BullMQ** is the modern, TypeScript-native rewrite built explicitly on top of Redis Streams and Lua scripts. It delivers higher throughput, better concurrency controls, and full type safety.

NestJS provides native integration via the **\`@nestjs/bullmq\`** package.

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│                        AppModule                        │
│   BullModule.forRootAsync() -> Configures Redis Host    │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                       EmailModule                       │
│  BullModule.registerQueue({ name: 'email-queue' })      │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               EmailProcessor (@Processor)               │
│  @Process('send-welcome-email') executes background job │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>Defining Workers with @Processor and @Process</b>

In NestJS, workers are annotated using the \`@Processor(QUEUE_NAME)\` decorator. Individual job handler methods are decorated with \`@Process('job-name')\`.

When a job arrives in the specified Redis queue:
1. BullMQ's event worker assigns the job payload to an available process thread.
2. NestJS invokes the corresponding decorated processor method.
3. The method receives the \`Job<T>\` context object containing the payload, progress tracking methods, and metadata.
4. Returning a resolved promise marks the job as **completed**; throwing an exception marks the job as **failed**.

<b>Job Concurrency</b>

By default, a worker processes one job at a time sequentially. To process multiple background tasks simultaneously on a single worker instance, set the \`concurrency\` parameter in the processor decorator:

\`\`\`ts
@Processor(EMAIL_QUEUE_NAME, { concurrency: 5 }) // Processes up to 5 jobs concurrently
\`\`\``,
      diagram: `                     BULLMQ WORKER EXECUTION
                                │
               Job Arrives in Redis ("email-queue")
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  BullMQ Worker Process   │
                   └────────────┬─────────────┘
                                │
                 Invokes @Process('send-email')
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
     [Promise Resolved]                   [Exception Thrown]
    Job state => COMPLETED               Job state => FAILED
     Purged / Archived                     Moved to Failed List`,
      codeExample: {
        title: "Code Example",
        code: `// src/email/email-consumer.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendEmailJobPayload } from './dto/send-email-job.dto';
import { EMAIL_QUEUE_NAME } from './email-producer.service';

@Processor(EMAIL_QUEUE_NAME, {
  concurrency: 5, // Process 5 jobs in parallel per worker instance
})
export class EmailConsumerProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailConsumerProcessor.name);

  /**
   * Main job handler execution entry point invoked by BullMQ.
   */
  async process(job: Job<SendEmailJobPayload>): Promise<any> {
    this.logger.log(\`[Job #\${job.id}] Processing \${job.name} for \${job.data.recipientEmail}\`);

    // Report progress (0-100) back to Redis for dashboard monitoring
    await job.updateProgress(25);

    switch (job.name) {
      case 'send-welcome-email':
        await this.handleWelcomeEmail(job.data);
        break;
      case 'send-invoice-email':
        await this.handleInvoiceEmail(job.data);
        break;
      default:
        throw new Error(\`Unknown job action type: \${job.name}\`);
    }

    await job.updateProgress(100);
    this.logger.log(\`[Job #\${job.id}] Successfully completed.\`);
    return { status: 'DELIVERED', timestamp: new Date().toISOString() };
  }

  private async handleWelcomeEmail(data: SendEmailJobPayload) {
    // Simulate SMTP network call
    if (!data.recipientEmail.includes('@')) {
      throw new Error('Invalid email address format');
    }
    // ... Third party provider dispatch logic (e.g. SendGrid / AWS SES)
  }

  private async handleInvoiceEmail(data: SendEmailJobPayload) {
    // ...
  }

  @OnWorkerEvent('failed')
  onJobFailed(job: Job, error: Error) {
    this.logger.error(\`[Job #\${job.id}] Failed with error: \${error.message}\`);
  }
}`,
      },
      keyTakeaways: [
        "BullMQ is the modern, TypeScript-native Redis queue engine built for NestJS applications.",
        "Classes extending \`WorkerHost\` decorated with \`@Processor()\` define background job workers.",
        "Set \`concurrency\` options to allow single worker instances to process multiple jobs in parallel.",
        "Track real-time job progress using \`job.updateProgress(percentage)\` for monitoring UIs.",
      ],
      commonMistakes: [
        "<b>Forgetting to export/import Queue modules properly.</b> Queues registered with \`BullModule.registerQueue()\` must be imported or exported correctly across domain modules.",
        "<b>Leaving default concurrency at 1 for low-I/O jobs.</b> Setting low concurrency on tasks bound by network I/O (like sending emails) starves worker throughput.",
      ],
      quiz: [
        {
          question: "How does a BullMQ Worker class indicate to Redis that a job succeeded or failed?",
          options: [
            "By writing a raw SQL query to PostgreSQL",
            "Returning a resolved promise marks it completed; throwing an unhandled exception marks it failed",
            "By calling process.exit(0)",
            "By sending a HTTP GET request to the controller"
          ],
          correctIndex: 1,
          explanation: "Returning normally from the worker \`process()\` method resolves the promise and marks the job completed; throwing an error rejects the promise and triggers failure/retry handlers."
        }
      ]
    },
    {
      id: "day-58-lesson-3",
      title: "Resilience Patterns: Retries and Exponential Backoff",
      durationMinutes: 24,
      explanation: `<b>Handling Failures in Unreliable Environments</b>

Background processing frequently interacts with external, third-party network dependencies:
- Third-party HTTP APIs (Payment Gateways, SMS gateways, Email APIs).
- Database connections or microservice RPC endpoints.

Networks drop packets, external APIs hit rate limits (HTTP 429), and remote servers restart. A production message queue must be resilient to transient failures using **Automatic Retries** and **Exponential Backoff Strategies**.

\`\`\`text
Job Execution Attempt 1 -> FAILS (Network Timeout)
  │
  ▼  Wait 1 second (Fixed Backoff)
Job Execution Attempt 2 -> FAILS (Rate Limited)
  │
  ▼  Wait 2 seconds (Exponential Backoff: 2^1 * base)
Job Execution Attempt 3 -> FAILS (Rate Limited)
  │
  ▼  Wait 4 seconds (Exponential Backoff: 2^2 * base)
Job Execution Attempt 4 -> SUCCESS! (Recovered)
\`\`\`

<b>Fixed vs Exponential Backoff Strategies</b>

1. <b>Fixed Backoff</b>: Retries the job after a fixed delay interval (e.g., retry every 5 seconds).
   - <i>Use Case</i>: Short-lived transient hiccups where fixed waiting is sufficient.
2. <b>Exponential Backoff</b>: Doubles the retry delay duration after each consecutive failure (e.g., 1s, 2s, 4s, 8s, 16s).
   - <i>Use Case</i>: Protecting downstream third-party servers that are recovering from high load or rate-limiting spikes.
3. <b>Backoff Jitter</b>: Adds randomized noise to exponential backoff delays to prevent all failed jobs from retrying simultaneously and hammering downstream APIs in waves.

<b>Configuring Retries in BullMQ</b>

When adding jobs to a queue, define explicit retry limits and backoff strategies:

\`\`\`ts
await this.queue.add('process-payment', payload, {
  attempts: 5, // Try up to 5 times before declaring permanent failure
  backoff: {
    type: 'exponential',
    delay: 1000, // Initial delay: 1000ms (1s)
  },
});
\`\`\``,
      diagram: `                   EXPONENTIAL BACKOFF RETRY FLOW
                               │
               Job Attempt #1 Fails (HTTP 503)
                               │
                               ▼
               Attempts (1) < Max Attempts (5)?
                               │
                               ▼
                     Calculate Backoff Delay:
                     delay = base * 2^(attempt - 1)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     Attempt 2: Wait 1s                   Attempt 3: Wait 2s
     Attempt 4: Wait 4s                   Attempt 5: Wait 8s
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                   Permanent Failure Reached?
                               │
                               ▼
                   Move to Dead-Letter Queue`,
      codeExample: {
        title: "Code Example",
        code: `// src/payments/payment-producer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface ProcessPaymentPayload {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
}

export const PAYMENT_QUEUE_NAME = 'payment-queue';

@Injectable()
export class PaymentProducerService {
  private readonly logger = new Logger(PaymentProducerService.name);

  constructor(
    @InjectQueue(PAYMENT_QUEUE_NAME)
    private readonly paymentQueue: Queue<ProcessPaymentPayload>,
  ) {}

  /**
   * Enqueues a payment processing job configured with Exponential Backoff retries.
   */
  async queuePayment(payload: ProcessPaymentPayload): Promise<string> {
    const job = await this.paymentQueue.add('charge-credit-card', payload, {
      // Retry configuration
      attempts: 5, // Allow up to 5 execution attempts
      backoff: {
        type: 'exponential', // Exponential backoff algorithm
        delay: 2000, // Base delay: 2 seconds (Delays: 2s, 4s, 8s, 16s)
      },
      // Job Lifecycle Options
      removeOnComplete: {
        age: 86400, // Keep completed job logs for 24 hours
        count: 1000,
      },
      removeOnFail: false, // Never auto-delete failed jobs (retained for DLQ auditing)
    });

    this.logger.log(\`Enqueued payment job #\${job.id} for order \${payload.orderId}\`);
    return job.id!;
  }
}`,
      },
      keyTakeaways: [
        "Use retries to automatically recover from transient network drops and third-party API rate limits.",
        "Exponential backoff doubles the retry delay between attempts, preventing recovering servers from getting spammed.",
        "Configuring \`attempts: N\` ensures transient failures are retried automatically before marking a job permanently failed.",
        "Retain failed job instances in Redis (\`removeOnFail: false\` or count limit) for inspection and manual replay.",
      ],
      commonMistakes: [
        "<b>Setting retries on non-idempotent operations without guard checks.</b> If a payment gateway charges a card but times out returning the response, retrying blindly without an idempotency key will charge the customer multiple times!",
        "<b>Using fixed backoff with short delays on rate-limited endpoints.</b> Retrying every 100ms when an external API returns HTTP 429 will prolong the rate-limit lock.",
      ],
      quiz: [
        {
          question: "Why is Exponential Backoff preferred over Fixed Backoff when retrying jobs that call external third-party APIs?",
          options: [
            "Exponential backoff bypasses third-party authentication",
            "It progressively increases wait times between attempts, giving recovering APIs time to clear traffic congestion",
            "Fixed backoff causes PostgreSQL database corruptions",
            "Exponential backoff runs on background threads"
          ],
          correctIndex: 1,
          explanation: "Exponential backoff expands wait times progressively (e.g. 2s, 4s, 8s, 16s), allowing recovering downstream services to stabilize."
        }
      ]
    },
    {
      id: "day-58-lesson-4",
      title: "Dead-Letter Queues (DLQ) & Failure Recovery",
      durationMinutes: 25,
      explanation: `<b>Managing Permanent Job Failures with Dead-Letter Queues</b>

When a job exhausts all configured retry attempts (e.g. 5 out of 5 attempts fail) or encounters an unrecoverable business error (such as an invalid credit card number), it enters the **Failed** state.

In production architectures, permanently failed jobs must be isolated into a **Dead-Letter Queue (DLQ)** or designated failed storage state so they do not obstruct active workers or get lost silently.

\`\`\`text
Job Attempt 1 (Fails) ──► Retry Backoff ──► Job Attempt 2 (Fails)
                                                │
                                                ▼ (Retries Exhausted)
                                    ┌──────────────────────┐
                                    │  Dead-Letter Queue   │
                                    │ (Failed Jobs Audit)  │
                                    └──────────┬───────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
              Alert Operations Team                           Inspect & Re-evaluate
            (Slack / PagerDuty / Log)                        (Manual Replay / Fix)
\`\`\`

<b>Why Dead-Letter Queues are Essential</b>

1. <b>Zero Data Loss</b>: Guarantees that unprocessable events (e.g., malformed payloads, database schema mismatches) are safely stored for developer investigation rather than silently dropped.
2. <b>Alerting & Visibility</b>: Triggers automated alerts (Slack messages, PagerDuty incidents) when dead-letter job counts exceed normal thresholds.
3. <b>Manual Inspection & Replay</b>: Allows administrators to inspect stack traces, fix root bugs or invalid data, and manually re-inject (retry) the job back into the primary active queue.

<b>Implementing DLQ Patterns in BullMQ</b>

BullMQ retains failed jobs in the queue's failed set when \`removeOnFail: false\` is configured. You can build a dedicated DLQ listener service or move failed jobs into an explicit secondary queue (\`payments-dlq\`) for specialized handling.`,
      diagram: `                   DEAD-LETTER QUEUE RECOVERY
                               │
                 Job Fails Final Retry Attempt
                               │
                               ▼
                   ┌──────────────────────────┐
                   │  Failed Set / DLQ Queue  │
                   └────────────┬─────────────┘
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
   Trigger Slack Alert                    Developer Fixes Bug
  "Payment #123 Failed"                   Calls job.retry()
                                                   │
                                                   ▼
                                        Re-injected into Queue`,
      codeExample: {
        title: "Code Example",
        code: `// src/payments/payment-dlq-management.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { PAYMENT_QUEUE_NAME, ProcessPaymentPayload } from './payment-producer.service';

@Injectable()
export class PaymentDlqManagementService {
  private readonly logger = new Logger(PaymentDlqManagementService.name);

  constructor(
    @InjectQueue(PAYMENT_QUEUE_NAME)
    private readonly paymentQueue: Queue<ProcessPaymentPayload>,
  ) {}

  /**
   * Fetches all dead-lettered / permanently failed jobs for auditing.
   */
  async getFailedJobs(): Promise<Array<{ id: string; name: string; failedReason: string; data: any }>> {
    const failedJobs = await this.paymentQueue.getFailed(0, 50);

    return failedJobs.map((job) => ({
      id: job.id!,
      name: job.name,
      failedReason: job.failedReason,
      data: job.data,
    }));
  }

  /**
   * Manually retries a specific dead-lettered job after resolving underlying issues.
   */
  async retryFailedJob(jobId: string): Promise<boolean> {
    const job = await this.paymentQueue.getJob(jobId);

    if (!job) {
      throw new Error(\`Job #\${jobId} not found in queue.\`);
    }

    const isFailed = await job.isFailed();
    if (!isFailed) {
      throw new Error(\`Job #\${jobId} is not in a failed state.\`);
    }

    // Move job back to 'waiting' state to be re-processed by workers
    await job.retry();
    this.logger.log(\`Successfully re-injected dead-letter job #\${jobId} into active queue.\`);
    return true;
  }

  /**
   * Purges all permanently failed jobs from memory.
   */
  async purgeDlq(): Promise<void> {
    await this.paymentQueue.clean(0, 0, 'failed');
    this.logger.log('Purged all failed jobs from payment queue.');
  }
}`,
      },
      keyTakeaways: [
        "Dead-Letter Queues capture jobs that have exhausted all retry attempts or encountered fatal errors.",
        "DLQs prevent data loss by retaining failed payloads and exception stack traces for developer investigation.",
        "Configure alerts (Slack, email, monitoring tools) when jobs enter the Dead-Letter Queue.",
        "Support manual replay operations (\`job.retry()\`) to re-enqueue failed jobs once bugs or third-party outages are resolved.",
      ],
      commonMistakes: [
        "<b>Configuring removeOnFail: true without logging.</b> Unhandled job failures get deleted from Redis immediately with no record of the payload or stack trace.",
        "<b>Retrying dead-letter jobs automatically without fixing underlying bugs.</b> Replaying malformed payload jobs in an infinite loop wastes system resources.",
      ],
      quiz: [
        {
          question: "What is the primary function of a Dead-Letter Queue (DLQ) in background job architectures?",
          options: [
            "To encrypt Redis passwords automatically",
            "To isolate and store permanently failed jobs for developer inspection, alerting, and manual replay",
            "To convert JSON payloads into raw SQL dumps",
            "To delete completed jobs from memory"
          ],
          correctIndex: 1,
          explanation: "Dead-Letter Queues hold permanently failed jobs so developers can inspect error traces, fix underlying bugs, and manually re-inject jobs without losing data."
        }
      ]
    },
    {
      id: "day-58-lesson-5",
      title: "Monitoring, Flow Control & BullMQ UI Dashboards",
      durationMinutes: 22,
      explanation: `<b>Production Operations & Queue Monitoring</b>

Operating background message queues in production requires visibility into queue health, job backlogs, and worker performance.

Key metrics to monitor:
- <b>Waiting Jobs</b>: Number of jobs queued up awaiting an available worker. High waiting counts indicate you need to scale up worker instances.
- <b>Active Jobs</b>: Number of jobs currently executing on workers.
- <b>Failed Jobs</b>: Rate of job failures. Sudden spikes signal third-party API outages or database lock issues.
- <b>Delayed Jobs</b>: Scheduled or backoff-paused jobs waiting for their timer window to elapse.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   BullMQ Board (UI)                    │
│   http://localhost:3000/admin/queues                   │
│                                                        │
│  [ Active: 12 ]  [ Waiting: 140 ]  [ Failed: 3 ]       │
│                                                        │
│  Queue: email-queue                                    │
│  ├── Job #1012: send-welcome-email (Active)            │
│  ├── Job #1013: send-welcome-email (Waiting)          │
│  └── Job #1008: send-invoice (Failed - Timeout) [Retry]│
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Integrating Bull-Board UI in NestJS</b>

**Bull-Board** (\`@bull-board/express\` or \`@bull-board/nestjs\`) provides an interactive web dashboard embedded directly within your NestJS application. Developers and operations teams can:
- View live queue stats and active worker loads.
- Inspect job payloads, return values, and stack traces.
- Manually trigger retries or purge failed jobs with a single click.

<b>Flow Control: Rate-Limiting Workers</b>

When background workers call external third-party APIs (e.g. sending SMS via Twilio with a rate limit of 10 requests/sec), workers can easily trigger HTTP 429 rate limits if left unconstrained. BullMQ supports native worker rate-limiting to throttle job consumption automatically:

\`\`\`ts
@Processor(SMS_QUEUE_NAME, {
  limiter: {
    max: 10, // Maximum 10 jobs
    duration: 1000, // Per 1000ms (1 second)
  },
})
\`\`\``,
      diagram: `                   WORKER RATE LIMITING FLOW
                               │
             Worker Configured: Max 10 Jobs / Sec
                               │
               15 Jobs Arrive in Queue Simultaneously
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
    Process 10 Jobs Instantly           Hold 5 Jobs in Queue
    (Within Rate Limit)                 (Delayed until next 1s window)
            │                                     │
            └──────────────────┬──────────────────┘
                               │
               Prevents Third-Party API 429 Errors`,
      codeExample: {
        title: "Code Example",
        code: `// src/admin/queues-dashboard.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE_NAME } from '../email/email-producer.service';
import { PAYMENT_QUEUE_NAME } from '../payments/payment-producer.service';

@Module({})
export class QueuesDashboardModule implements NestModule {
  private readonly serverAdapter = new ExpressAdapter();

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME) private emailQueue: Queue,
    @InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue,
  ) {
    // Set base path for web dashboard route
    this.serverAdapter.setBasePath('/admin/queues');

    // Mount queues into Bull-Board dashboard UI
    createBullBoard({
      queues: [
        new BullMQAdapter(this.emailQueue),
        new BullMQAdapter(this.paymentQueue),
      ],
      serverAdapter: this.serverAdapter,
    });
  }

  configure(consumer: MiddlewareConsumer) {
    // Expose dashboard interface under /admin/queues
    consumer
      .apply(this.serverAdapter.getRouter())
      .forRoutes('/admin/queues');
  }
}`,
      },
      keyTakeaways: [
        "Monitor waiting, active, delayed, and failed job metrics to gauge queue health.",
        "Integrate Bull-Board UI to provide an interactive dashboard for inspecting and replaying jobs.",
        "Configure worker rate-limiters (\`limiter\`) to prevent background jobs from exceeding third-party API rate caps.",
        "Secure the dashboard endpoint in production using authentication guards to protect sensitive job payloads.",
      ],
      commonMistakes: [
        "<b>Exposing the Bull-Board dashboard publicly without authentication.</b> Unprotected queue dashboards leak sensitive customer payloads and allow unauthorized users to trigger job purges.",
        "<b>Ignoring waiting job growth spikes.</b> High waiting counts mean workers are under-provisioned; set up auto-scaling or raise concurrency limits.",
      ],
      quiz: [
        {
          question: "How does configuring a 'limiter' on a BullMQ Processor protect external APIs?",
          options: [
            "It automatically disables third-party API keys",
            "It caps the number of jobs processed within a specific time window, preventing workers from overwhelming rate-limited third-party APIs",
            "It compresses JSON payloads in Redis memory",
            "It encrypts database connection strings"
          ],
          correctIndex: 1,
          explanation: "Worker rate limiters enforce a maximum execution throughput (e.g., 10 jobs/sec), ensuring third-party APIs are not flooded with requests."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What problem do asynchronous message queues solve in web REST APIs?",
      options: [
        "They replace PostgreSQL for relational data storage",
        "They offload heavy or unreliable tasks from HTTP request threads, improving response times and fault tolerance",
        "They compile TypeScript to JavaScript faster",
        "They eliminate the need for JWT authentication"
      ],
      correctIndex: 1,
      explanation: "Queues decouple HTTP request/response lifecycles from heavy or slow operations, allowing APIs to respond in milliseconds while tasks execute in the background."
    },
    {
      question: "In BullMQ, what package provides native integration with the NestJS dependency injection framework?",
      options: [
        "@nestjs/microservices",
        "@nestjs/bullmq",
        "express-queue",
        "redis-worker-nest"
      ],
      correctIndex: 1,
      explanation: "\`@nestjs/bullmq\` is the official framework module providing decorators like \`@Processor\` and \`@InjectQueue\`."
    },
    {
      question: "What is the key characteristic of Exponential Backoff retries?",
      options: [
        "The retry delay remains constant across all failed attempts",
        "The wait time doubles progressively after each consecutive failure attempt",
        "It cancels the job permanently after 1 millisecond",
        "It deletes failed jobs from Redis memory immediately"
      ],
      correctIndex: 1,
      explanation: "Exponential backoff expands the wait time between retries exponentially (e.g. 2s, 4s, 8s, 16s), easing pressure on recovering downstream services."
    },
    {
      question: "What happens to a job in BullMQ when all configured retry attempts fail?",
      options: [
        "It is permanently lost with no record",
        "It moves to the 'failed' set (Dead-Letter set) for developer auditing and manual replay",
        "It automatically restarts the NestJS application process",
        "It creates a new PostgreSQL database table"
      ],
      correctIndex: 1,
      explanation: "Exhausting retries transitions the job to the failed set (DLQ state) where payload details and stack traces are preserved for inspection."
    },
    {
      question: "Why should job payloads passed to queue.add() contain minimal, serializable data (like IDs) rather than full database object trees?",
      options: [
        "Because Redis cannot store plain strings",
        "To minimize Redis memory overhead and prevent stale data bugs when the worker fetches fresh database state",
        "Because BullMQ requires XML formatting",
        "Because NestJS controllers prohibit JSON serialization"
      ],
      correctIndex: 1,
      explanation: "Passing lightweight entity IDs keeps Redis memory usage minimal and ensures workers load up-to-date entity state from the database at execution time."
    },
    {
      question: "What decorator in NestJS BullMQ marks a class as a background queue processor?",
      options: ["@Injectable()", "@Processor()", "@QueueWorker()", "@TaskRunner()"],
      correctIndex: 1,
      explanation: "The \`@Processor('queue-name')\` decorator identifies a worker class responsible for consuming jobs from a specific queue."
    },
    {
      question: "How can operations teams visually inspect queue backlogs and manually retry failed jobs in NestJS?",
      options: [
        "By querying PostgreSQL raw tables",
        "By integrating Bull-Board UI middleware into a dashboard route",
        "By reading NestJS build logs",
        "By running npm run test:e2e"
      ],
      correctIndex: 1,
      explanation: "Bull-Board provides a visual web dashboard showing waiting, active, and failed jobs alongside manual retry controls."
    }
  ],
  project: {
    name: "Resilient Background Job & Notification Queue Engine",
    goal: "Build an enterprise background task processing service in NestJS using BullMQ, Redis, Exponential Backoff retries, Dead-Letter Queue management, and a visual Bull-Board monitoring dashboard.",
    brief: "Construct a multi-queue background processing engine in NestJS. Implement an Email Notification Queue and a High-Priority Payment Queue. Configure workers with concurrency limits and exponential backoff retries, build a Dead-Letter Queue (DLQ) administrative endpoint for replaying failed transactions, and expose a secured Bull-Board dashboard.",
    steps: [
      "Configure BullModule.forRootAsync() connecting NestJS to a Redis instance.",
      "Register 'email-queue' and 'payment-queue' using BullModule.registerQueue().",
      "Create EmailProducerService and PaymentProducerService for enqueuing jobs with explicit attempt limits and exponential backoff strategies.",
      "Implement EmailConsumerProcessor and PaymentConsumerProcessor with concurrency limits and job progress tracking.",
      "Develop a DLQ management service with endpoints to list failed jobs and trigger manual retries via job.retry().",
      "Mount Bull-Board dashboard middleware under '/admin/queues' to monitor queue state visually.",
      "Write unit and e2e integration tests asserting job enqueuing, successful processing, failure retries, and DLQ recovery."
    ],
    acceptance: [
      "API endpoints enqueue jobs and return HTTP responses in under 50ms.",
      "Failed network tasks are retried up to 5 times using exponential backoff before transitioning to the failed state.",
      "Dead-lettered jobs can be retrieved and manually re-injected via administrative APIs.",
      "Bull-Board UI accurately displays active, waiting, and failed job counts."
    ],
    stretch: [
      "Add worker rate limiters to respect third-party API quota limits.",
      "Implement delayed job scheduling (e.g. sending a follow-up email 24 hours after registration)."
    ]
  }
};