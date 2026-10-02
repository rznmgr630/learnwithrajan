import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_59_LESSONS: LessonDay = {
  day: 59,
  title: "Deep Dive into BullMQ: States, Lifecycle & Advanced Scheduling",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-59-lesson-1",
      title: "BullMQ Architecture: Queues, Workers, and Redis Data Structures",
      durationMinutes: 24,
      explanation: `<b>Understanding BullMQ's Underlying Redis Engine</b>

BullMQ is built on top of Redis streams, hashes, set abstractions, and Lua scripts to deliver atomic, multi-producer/multi-consumer background processing. Unlike naive polling queues that constantly query database tables (e.g. \`SELECT * FROM jobs WHERE status = 'pending'\`), BullMQ leverages **Redis Streams (\`XADD\`, \`XREADGROUP\`)** and **Sorted Sets (ZSets)** for instant, event-driven execution.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   NestJS Application                   │
│                                                        │
│   ┌───────────────────┐        ┌───────────────────┐   │
│   │   OrderProducer   │        │  NotificationSvc  │   │
│   └─────────┬─────────┘        └─────────┬─────────┘   │
└─────────────┼────────────────────────────┼─────────────┘
              │ queue.add('process', data) │
              ▼                            ▼
┌────────────────────────────────────────────────────────┐
│                    Redis Engine                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Streams: bull:<queue>:events (Pub/Sub Notifications)│  │
│  │ Hashes: bull:<queue>:<jobId> (Serialized Payload)│  │
│  │ ZSets: bull:<queue>:delayed (Timers & Scheduled) │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │ Atomically claimed via Lua
                              ▼
┌────────────────────────────────────────────────────────┐
│                   BullMQ Worker Host                   │
│         @Processor('orders') -> Worker Process         │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>How Jobs are Represented in Redis</b>

Every job created in BullMQ consists of several underlying Redis entries:
1. <b>Job Hash (\`bull:<queue-name>:<job-id>\`)</b>: A Redis Hash storing the serialized job name, data payload, options, progress, stack traces, and return values.
2. <b>Waiting List (\`bull:<queue-name>:wait\`)</b>: A list or stream holding job IDs waiting to be claimed by available workers.
3. <b>Active Set (\`bull:<queue-name>:active\`)</b>: A list containing IDs of jobs currently undergoing execution in a worker thread.
4. <b>Lock Strings (\`bull:<queue-name>:<job-id>:lock\`)</b>: A distributed lock set with TTLs to prevent multiple workers from executing the exact same job instance concurrently.

<b>The Role of Lua Scripts in Job Claims</b>

When a worker claims a job from the queue, it doesn't execute multiple independent network calls (\`GET\`, \`DEL\`, \`SET\`). Instead, BullMQ sends a single pre-compiled **Lua Script** to Redis. Redis executes the script atomically: verifying lock availability, moving the job ID from \`waiting\` to \`active\`, and extending the lock duration in a single thread execution cycle.`,
      diagram: `                BULLMQ REDIS DATA MAP
                           │
             queue.add("send-sms", payload)
                           │
                           ▼
          ┌──────────────────────────────────┐
          │      Redis Keys Generated        │
          ├──────────────────────────────────┤
          │ Hash: bull:sms:101               │
          │ List: bull:sms:wait [101]        │
          │ Stream: bull:sms:events          │
          └────────────────┬─────────────────┘
                           │
             Worker Executes Atomic Lua Script
                           │
                           ▼
          ┌──────────────────────────────────┐
          │      State Shift in Redis        │
          ├──────────────────────────────────┤
          │ Move 101: wait -> active         │
          │ Set Key: bull:sms:101:lock       │
          └──────────────────────────────────┘`,
      codeExample: {
        title: "Code Example",
        code: `// src/queues/queue-config.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          maxRetriesPerRequest: null, // Mandatory requirement for BullMQ workers!
          enableReadyCheck: false,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: { age: 3600, count: 1000 }, // Clean complete jobs after 1 hour or 1k entries
          removeOnFail: false, // Keep failed jobs for DLQ investigation
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueueConfigModule {}`,
      },
      keyTakeaways: [
        "BullMQ relies on Redis Hashes, Streams, Lists, and Sorted Sets for persistent queue state.",
        "State changes and job claims are executed atomically inside Redis using pre-compiled Lua scripts.",
        "Set \`maxRetriesPerRequest: null\` in ioredis settings as explicitly required by BullMQ worker instances.",
        "Job locks prevent concurrent workers from claiming or executing the same active job twice.",
      ],
      commonMistakes: [
        "<b>Setting maxRetriesPerRequest to a finite number on worker ioredis connections.</b> BullMQ blocking commands (\`BRPOPLPUSH\`, \`XREADGROUP\`) require \`maxRetriesPerRequest: null\` to prevent client connection crashes.",
        "<b>Storing large binary blobs directly in job data payloads.</b> Payloads are saved directly in Redis Hashes; store references (e.g. S3 file keys) rather than raw binary data.",
      ],
      quiz: [
        {
          question: "Why must ioredis connections passed to BullMQ Workers set 'maxRetriesPerRequest: null'?",
          options: [
            "Because BullMQ does not support Redis password authentication",
            "To allow long-polling blocking queue commands to wait indefinitely for new jobs without timing out or throwing connection errors",
            "To disable AOF disk persistence",
            "To force NestJS to execute jobs on the main HTTP thread"
          ],
          correctIndex: 1,
          explanation: "BullMQ worker processes rely on blocking connection calls to wait for new jobs. Setting \`maxRetriesPerRequest: null\` prevents ioredis from aborting blocking commands when waiting for idle queues."
        }
      ]
    },
    {
      id: "day-59-lesson-2",
      title: "Job States, Lifecycle Hooks, and Progress Tracking",
      durationMinutes: 25,
      explanation: `<b>The Complete Lifecycle of a BullMQ Job</b>

A job in BullMQ transitions through a deterministic state machine during its lifecycle inside Redis:

\`\`\`text
                  JOB STATE TRANSITION MACHINE
                               │
                       queue.add("job")
                               │
                               ▼
                        ┌─────────────┐
                        │   WAITING   │ ◄──── Delayed Timer Elapses
                        └──────┬──────┘
                               │ Worker Claims Job
                               ▼
                        ┌─────────────┐
                        │   ACTIVE    │
                        └──────┬──────┘
            ┌──────────────────┴──────────────────┐
            │ Worker Resolves                     │ Worker Throws Error
            ▼                                     ▼
     ┌─────────────┐                       ┌─────────────┐
     │  COMPLETED  │                       │   FAILED    │
     └─────────────┘                       └──────┬──────┘
                                                  │ Retries Available?
                                           ┌──────┴──────┐
                                           ▼             ▼
                                        [YES]          [NO]
                                          │              │
                                    Move to DELAYED    Remain in
                                    (Retry Backoff)    FAILED Set
\`\`\`

<b>Understanding the Core States</b>

1. <b>Waiting</b>: The job is queued in Redis waiting for an available worker thread.
2. <b>Active</b>: A worker has claimed the job lock and is executing the process method.
3. <b>Completed</b>: The worker method resolved successfully. Return values are saved in the job hash.
4. <b>Failed</b>: The worker method threw an unhandled error. If retries remain, it transitions to \`delayed\`; otherwise, it remains in \`failed\`.
5. <b>Delayed</b>: The job is held in a Redis Sorted Set (ZSet) indexed by timestamp until its execution or retry timer elapses.
6. <b>Paused</b>: The queue is paused administratively; waiting jobs are held until resumed.

<b>Progress Tracking & Event Monitoring</b>

Workers can report real-time execution progress percentage (0–100) or structured status objects back to Redis using \`job.updateProgress()\`. Monitoring tools or WebSockets can subscribe to worker event listeners (\`@OnWorkerEvent('progress')\`, \`@OnWorkerEvent('completed')\`) to stream live progress to frontend dashboards.`,
      diagram: `                   REAL-TIME PROGRESS STREAMING
                               │
               Worker Executes Long-Running Task
                               │
             job.updateProgress(25) -> Writes to Redis
                               │
                               ▼
                 @OnWorkerEvent('progress') Listener
                               │
                               ▼
             Broadcast via WebSockets to Frontend UI`,
      codeExample: {
        title: "Code Example",
        code: `// src/reports/report-processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export interface GenerateReportPayload {
  reportId: string;
  startDate: string;
  endDate: string;
}

export const REPORT_QUEUE_NAME = 'report-generation-queue';

@Processor(REPORT_QUEUE_NAME, { concurrency: 2 })
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  async process(job: Job<GenerateReportPayload>): Promise<{ reportUrl: string }> {
    this.logger.log(\`Starting report generation for ID: \${job.data.reportId}\`);

    // Step 1: Query raw data
    await job.updateProgress(10);
    await this.simulateDelay(1000);

    // Step 2: Compute aggregations
    await job.updateProgress(50);
    await this.simulateDelay(1500);

    // Step 3: Render PDF document
    await job.updateProgress(90);
    await this.simulateDelay(1000);

    const reportUrl = \`https://s3.amazonaws.com/reports/\${job.data.reportId}.pdf\`;

    await job.updateProgress(100);
    return { reportUrl };
  }

  private simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.logger.log(\`Job #\${job.id} progress update: \${progress}%\`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(\`Job #\${job.id} completed. Result URL: \${result.reportUrl}\`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(\`Job #\${job.id} failed after \${job.attemptsMade} attempts: \${err.message}\`);
  }
}`,
      },
      keyTakeaways: [
        "Jobs move deterministically through states: Waiting, Active, Completed, Failed, Delayed, and Paused.",
        "Jobs with configured delays or active retry backoffs are held in a Redis Sorted Set (ZSet).",
        "Call \`job.updateProgress()\` inside long-running tasks to report real-time status to dashboards.",
        "Attach event handlers like \`@OnWorkerEvent('completed')\` or \`@OnWorkerEvent('failed')\` for logging and metrics.",
      ],
      commonMistakes: [
        "<b>Forgetting that failed jobs with remaining retries transition to Delayed state.</b> Expecting a failed job to show in the failed set immediately when it still has pending retries causes confusion; inspect the delayed ZSet instead.",
        "<b>Updating progress with large non-serializable objects.</b> Progress updates write directly to Redis; pass numbers or small, flat status objects.",
      ],
      quiz: [
        {
          question: "Where does BullMQ store jobs that are configured with a delayed start time or are waiting for a retry backoff window?",
          options: [
            "In a PostgreSQL temporary table",
            "In a Redis Sorted Set (ZSet) indexed by timestamp",
            "In Node.js process memory",
            "In a plain text log file"
          ],
          correctIndex: 1,
          explanation: "BullMQ stores delayed jobs in a Redis Sorted Set (ZSet), using the future target timestamp as the score for efficient time-based scheduling."
        }
      ]
    },
    {
      id: "day-55-lesson-3",
      title: "Delayed Jobs and Scheduled Processing",
      durationMinutes: 24,
      explanation: `<b>Executing Tasks in the Future</b>

Not all background processing should happen immediately. Applications frequently need to schedule tasks to run after a specific time delay:
- Sending a cart abandonment reminder email **2 hours** after a user leaves the website.
- Downgrading an account subscription **30 days** after a cancellation request.
- Cancelling an unpaid reservation if payment is not received within **15 minutes**.

\`\`\`text
API Request: Order Created -> Payment Pending
                     │
                     ▼
  queue.add("cancel-unpaid-order", payload, { delay: 900000 }) (15 min)
                     │
                     ▼
      Redis ZSet: Score = CurrentTime + 15 mins
                     │
         [Wait 15 Minutes in Redis ZSet]
                     │
                     ▼
      Timestamp Reached! Move ZSet -> Waiting List
                     │
                     ▼
      Worker Claims Job -> Checks Order Payment Status in DB
\`\`\`

<b>How Delayed Jobs Function Under the Hood</b>

When you enqueue a job with the \`delay\` option:
1. BullMQ adds the job hash to Redis and pushes its ID into the **delayed ZSet** (\`bull:<queue>:delayed\`) with a score equal to \`Date.now() + delayMs\`.
2. A built-in timer component in BullMQ polls the top of the ZSet.
3. As soon as \`Date.now() >= score\`, BullMQ executes an atomic Lua script that moves the job ID from the \`delayed\` ZSet into the \`waiting\` list.
4. Available worker threads pick up the job and execute it normally.

<b>Dynamic Delay Calculation</b>

Delay durations can be calculated dynamically based on target dates:

\`\`\`ts
const targetDate = new Date('2026-11-01T00:00:00Z');
const delayMs = targetDate.getTime() - Date.now();

await queue.add('send-scheduled-newsletter', payload, {
  delay: Math.max(0, delayMs),
});
\`\`\``,
      diagram: `                   DELAYED JOB SCHEDULING FLOW
                               │
               queue.add("task", data, { delay: 60000 })
                               │
                               ▼
                   ┌──────────────────────────┐
                   │ Redis ZSet: delayed      │
                   │ Score: 1710000060000     │
                   └────────────┬─────────────┘
                                │
                  Timer Engine Monitors Score
                                │
                    Current Timestamp >= Score
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  Redis List: wait        │
                   └────────────┬─────────────┘
                                │
                          Worker Consumes`,
      codeExample: {
        title: "Code Example",
        code: `// src/orders/order-expiration.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface CancelOrderJobPayload {
  orderId: string;
  userId: string;
}

export const ORDER_EXPIRATION_QUEUE = 'order-expiration-queue';

@Injectable()
export class OrderExpirationService {
  private readonly logger = new Logger(OrderExpirationService.name);

  constructor(
    @InjectQueue(ORDER_EXPIRATION_QUEUE)
    private readonly expirationQueue: Queue<CancelOrderJobPayload>,
  ) {}

  /**
   * Schedules a delayed job to check and cancel an unpaid order after 15 minutes.
   */
  async scheduleOrderExpirationCheck(orderId: string, userId: string): Promise<string> {
    const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

    const job = await this.expirationQueue.add(
      'expire-unpaid-order',
      { orderId, userId },
      {
        delay: FIFTEEN_MINUTES_MS,
        jobId: \`expire-order-\${orderId}\`, // Explicit ID prevents duplicate expiration timers
        removeOnComplete: true,
      },
    );

    this.logger.log(\`Scheduled expiration check for order \${orderId} in 15 minutes. Job ID: \${job.id}\`);
    return job.id!;
  }

  /**
   * Cancels a scheduled delayed expiration job if the user pays before the timeout.
   */
  async cancelScheduledExpiration(orderId: string): Promise<boolean> {
    const jobId = \`expire-order-\${orderId}\`;
    const job = await this.expirationQueue.getJob(jobId);

    if (job) {
      await job.remove();
      this.logger.log(\`Removed scheduled expiration timer for paid order \${orderId}\`);
      return true;
    }

    return false;
  }
}`,
      },
      keyTakeaways: [
        "Delayed jobs allow scheduling task execution for a specific relative offset or absolute timestamp.",
        "Delayed jobs are held in a Redis Sorted Set (ZSet) and do not consume worker processing threads while waiting.",
        "Assign explicit custom \`jobId\` values (e.g., \`expire-order-123\`) to easily locate and remove scheduled timers if conditions change.",
        "If the specified delay duration is $\le 0$, BullMQ enqueues the job into the waiting list immediately.",
      ],
      commonMistakes: [
        "<b>Using Node.js setTimeout() instead of delayed queue jobs for long durations.</b> If the API container restarts, in-memory \`setTimeout\` timers disappear forever; Redis delayed jobs survive container restarts.",
        "<b>Forgetting to remove scheduled delayed jobs when an action is completed early.</b> Leaving an order expiration timer active after an order has been paid can lead to accidental order cancellations if your worker lacks idempotency checks.",
      ],
      quiz: [
        {
          question: "Why are BullMQ delayed jobs superior to in-memory Node.js setTimeout() calls for scheduling future tasks?",
          options: [
            "setTimeout() cannot handle delays longer than 1 second",
            "BullMQ delayed jobs are persisted in Redis and survive application server restarts or deployments",
            "setTimeout() blocks the main HTTP thread for the entire delay duration",
            "Node.js prohibits setTimeout() in production code"
          ],
          correctIndex: 1,
          explanation: "In-memory JavaScript timers are lost if the process restarts or crashes. BullMQ persists delayed jobs in Redis, ensuring reliable future execution across deployments."
        }
      ]
    },
    {
      id: "day-59-lesson-4",
      title: "Repeatable Jobs and Cron Scheduling",
      durationMinutes: 25,
      explanation: `<b>Replacing Monolithic Cron Jobs with Queue-Based Repeatable Jobs</b>

In traditional single-server architecture, developers frequently use system cron jobs (like \`crontab\` or NestJS \`@Cron()\`) to trigger recurring tasks (e.g., generating nightly sales summaries or clearing temporary uploads every Sunday).

However, in horizontal cloud deployments with multiple scaled container replicas, local \`@Cron()\` annotations fire simultaneously on **every running instance**, causing duplicate job runs and race conditions.

BullMQ solves this using **Repeatable Jobs**.

\`\`\`text
┌─────────────────────────────────────────────────────────┐
│                 Scaled NestJS Cluster                   │
│   Pod A                    Pod B                   Pod C│
└─────┬────────────────────────┼───────────────────────┬──┘
      │                        │                       │
      └────────────────────────┼───────────────────────┘
                               │ Upsert Repeatable Job
                               ▼
┌─────────────────────────────────────────────────────────┐
│                   Redis Repeatable ZSet                 │
│         Next execution: 2026-10-03 00:00:00 UTC          │
└───────────────────────────┬─────────────────────────────┘
                            │
              Fires EXACTLY ONCE across Cluster
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Available Worker                      │
│            Executes Nightly Processing Task             │
└─────────────────────────────────────────────────────────┘
\`\`\`

<b>Cron Patterns vs Interval Options</b>

Repeatable jobs can be scheduled using standard Cron expressions or fixed millisecond intervals:

1. <b>Cron Syntax</b>: \`repeat: { pattern: '0 0 * * *' }\` (Runs every midnight).
2. <b>Interval Syntax</b>: \`repeat: { every: 60000 }\` (Runs every 60 seconds).
3. <b>Limit Execution Count</b>: \`repeat: { every: 5000, limit: 10 }\` (Runs 10 times then stops).

<b>Managing Repeatable Job Identifiers</b>

When registering repeatable jobs during startup, BullMQ generates an internal key based on the queue name, job name, and pattern (e.g. \`email-queue:nightly-digest:::0 0 * * *\`). Calling \`queue.add()\` with the same pattern updates the existing schedule rather than creating duplicate recurring timers.`,
      diagram: `                   REPEATABLE JOB SCHEDULING
                               │
            queue.add("cleanup", {}, { repeat: { pattern: "0 2 * * *" } })
                               │
                               ▼
            ┌────────────────────────────────────┐
            │   Redis Scheduled Repeatable Set   │
            └──────────────────┬─────────────────┘
                               │
                 Fires Nightly at 02:00 AM
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
    Create Active Job                   Calculate Next Execution
     Worker Processes                    And Re-insert into ZSet`,
      codeExample: {
        title: "Code Example",
        code: `// src/scheduler/recurring-tasks.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const RECURRING_QUEUE_NAME = 'recurring-tasks-queue';

@Injectable()
export class RecurringTasksService implements OnModuleInit {
  private readonly logger = new Logger(RecurringTasksService.name);

  constructor(
    @InjectQueue(RECURRING_QUEUE_NAME)
    private readonly recurringQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.setupRepeatableJobs();
  }

  private async setupRepeatableJobs() {
    // 1. Daily Midnight Cleanup Task (Cron Syntax)
    await this.recurringQueue.add(
      'daily-db-cleanup',
      { scope: 'EXPIRED_SESSIONS' },
      {
        repeat: {
          pattern: '0 0 * * *', // Every day at 00:00 UTC
        },
        jobId: 'daily-db-cleanup-job', // Prevents duplicate registrations
      },
    );

    // 2. High-Frequency Metric Synchronization (Every 5 minutes)
    await this.recurringQueue.add(
      'sync-redis-metrics',
      { target: 'PROMETHEUS' },
      {
        repeat: {
          every: 5 * 60 * 1000, // 5 minutes in ms
        },
        jobId: 'sync-redis-metrics-job',
      },
    );

    this.logger.log('Repeatable queue jobs registered successfully.');
  }

  /**
   * Utility method to remove an existing repeatable job schedule.
   */
  async removeRepeatableJob(name: string, pattern: string) {
    await this.recurringQueue.removeRepeatable(name, { pattern });
    this.logger.log(\`Removed repeatable job \${name} with pattern \${pattern}\`);
  }
}`,
      },
      keyTakeaways: [
        "Repeatable jobs replace local node \`@Cron()\` annotations to prevent duplicate executions in multi-pod deployments.",
        "Define schedules using standard Cron expressions (\`pattern\`) or fixed durations (\`every\`).",
        "BullMQ guarantees that exactly one worker across the cluster processes each scheduled instance.",
        "Use \`queue.removeRepeatable()\` to remove scheduled jobs programmatically.",
      ],
      commonMistakes: [
        "<b>Mixing local NestJS @Cron() with scaled multi-instance deployments.</b> Local cron triggers fire on every instance simultaneously; use BullMQ repeatable jobs to ensure single execution across the cluster.",
        "<b>Changing cron pattern strings without purging old repeatable job keys.</b> Changing a pattern from \`0 * * * *\` to \`*/30 * * * *\` without calling \`removeRepeatable()\` leaves the old schedule running alongside the new one.",
      ],
      quiz: [
        {
          question: "Why should developers use BullMQ Repeatable Jobs instead of local NestJS @Cron() decorators in a multi-instance Kubernetes deployment?",
          options: [
            "Local @Cron() decorators cannot execute database queries",
            "Local @Cron() triggers run independently on every running pod, resulting in duplicate executions across the cluster",
            "BullMQ repeatable jobs do not require Redis",
            "@Cron() decorators are limited to running once per week"
          ],
          correctIndex: 1,
          explanation: "In multi-pod environments, local \`@Cron()\` decorators execute on every container replica concurrently. BullMQ repeatable jobs manage scheduling via Redis, ensuring a single execution across the cluster."
        }
      ]
    },
    {
      id: "day-59-lesson-5",
      title: "Advanced Retry Strategies and Failure Handling",
      durationMinutes: 22,
      explanation: `<b>Designing Resilient Retry Policies</b>

In production, background job failures fall into two categories:
1. <b>Transient Failures</b>: Temporary issues like network timeouts, database connection pool exhaustion, or external API rate limits (HTTP 429). These should be retried automatically with backoff.
2. <b>Fatal Non-Retryable Errors</b>: Logical errors like malformed JSON, invalid user IDs, or unhandled null references. Retrying these wastes system resources.

\`\`\`text
Job Execution Throws Exception
               │
               ▼
   Is Error Fatal / Unrecoverable?
   ┌───────────┴───────────┐
 [YES]                   [NO]
   │                       │
 Abort Retries       Apply Retry Backoff
 Move to Failed Set   (Fixed / Exponential)
   (DLQ)                   │
                           ▼
                  Re-queue in Delayed Set
\`\`\`

<b>Custom Backoff Strategies in BullMQ</b>

While BullMQ provides built-in \`fixed\` and \`exponential\` backoff algorithms out of the box, enterprise applications often require **Custom Backoff Strategies** (e.g. inspecting response status codes or applying custom rate-limit delay calculations).

You can register custom backoff functions directly inside your worker configurations:

\`\`\`ts
const worker = new Worker('payments', processor, {
  settings: {
    backoffStrategies: {
      customRateLimitBackoff(attemptsMade, err) {
        if (err.message.includes('RATE_LIMITED')) {
          return 60000; // Delay for 60 seconds if rate limited
        }
        return attemptsMade * 2000; // Default linear delay
      },
    },
  },
});
\`\`\`

<b>Unrecoverable Errors (\`UnrecoverableError\`)</b>

If a worker detects an unrecoverable business condition (e.g. \`User ID does not exist in DB\`), throwing a standard \`Error\` will trigger all remaining retry attempts unnecessarily.

By throwing BullMQ's explicit **\`UnrecoverableError\`**, the worker halts retries immediately and moves the job directly to the failed set.`,
      diagram: `                   ADVANCED RETRY FLOW
                               │
               Worker Executes Job -> Throws Exception
                               │
                               ▼
                   Is UnrecoverableError?
                   ┌───────────┴───────────┐
            [YES]                         [NO]
              │                             │
     Halt All Retries             Attempts < Max Attempts?
     Move to Failed Set           ┌─────────┴─────────┐
                                [YES]               [NO]
                                  │                   │
                        Apply Backoff Delay     Move to Failed Set
                        Move to Delayed Set`,
      codeExample: {
        title: "Code Example",
        code: `// src/payments/payment-processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';

export interface ChargeCustomerPayload {
  customerId: string;
  amount: number;
}

export const CHARGE_QUEUE = 'charge-customer-queue';

@Processor(CHARGE_QUEUE, {
  concurrency: 3,
})
export class PaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentProcessor.name);

  async process(job: Job<ChargeCustomerPayload>): Promise<any> {
    this.logger.log(\`Processing charge job #\${job.id} for customer \${job.data.customerId}\`);

    // 1. Validate customer existence
    const customerExists = await this.checkCustomerExists(job.data.customerId);
    if (!customerExists) {
      // Throw UnrecoverableError to bypass retries and fail immediately
      throw new UnrecoverableError(\`Customer \${job.data.customerId} does not exist. Retries aborted.\`);
    }

    // 2. Process third-party gateway payment
    try {
      return await this.chargeGateway(job.data.amount);
    } catch (err: any) {
      if (err.status === 429) {
        this.logger.warn(\`Gateway rate limited job #\${job.id}. Will trigger backoff strategy.\`);
        throw new Error('GATEWAY_RATE_LIMITED');
      }
      throw err;
    }
  }

  private async checkCustomerExists(customerId: string): Promise<boolean> {
    return customerId !== 'invalid_cust_999';
  }

  private async chargeGateway(amount: number) {
    // Simulate gateway behavior
    if (Math.random() < 0.3) {
      const error: any = new Error('Gateway busy');
      error.status = 429;
      throw error;
    }
    return { transactionId: \`tx_\${Date.now()}\` };
  }
}`,
      },
      keyTakeaways: [
        "Distinguish between transient network failures and fatal non-retryable logical errors.",
        "Throw \`UnrecoverableError\` to abort remaining retries immediately for unrecoverable errors.",
        "Register custom backoff functions to handle specialized rate-limit delays or status code handling.",
        "Audit permanently failed jobs using Dead-Letter Queue monitoring patterns.",
      ],
      commonMistakes: [
        "<b>Allowing invalid payload jobs to exhaust all retry attempts.</b> Throwing standard errors on missing database references wastes system resources; throw \`UnrecoverableError\` instead.",
        "<b>Retrying payment requests without idempotency keys.</b> Ensure payment handlers are idempotent so retries do not charge customers twice.",
      ],
      quiz: [
        {
          question: "What happens when a BullMQ worker throws an explicit 'UnrecoverableError' during job execution?",
          options: [
            "BullMQ restarts the Redis server process",
            "All remaining retry attempts are bypassed and the job moves directly to the failed state",
            "The job is re-enqueued with a 1-hour delay",
            "The worker process terminates permanently"
          ],
          correctIndex: 1,
          explanation: "Throwing an \`UnrecoverableError\` signals to BullMQ that the failure cannot be resolved by retrying, moving the job straight to the failed set."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "Which Redis data structure does BullMQ use to manage delayed and repeatable job timers?",
      options: [
        "Strings",
        "Sorted Sets (ZSets)",
        "HyperLogLogs",
        "Bitmaps"
      ],
      correctIndex: 1,
      explanation: "BullMQ uses Redis Sorted Sets (ZSets) indexed by target execution timestamps to manage delayed and scheduled job timers."
    },
    {
      question: "What is the primary operational advantage of BullMQ Repeatable Jobs over local node scheduling decorators (@Cron)?",
      options: [
        "Repeatable jobs do not require a Redis instance",
        "Repeatable jobs ensure single execution across a multi-node scaled cluster, whereas local @Cron decorators run on every pod simultaneously",
        "Repeatable jobs run faster than local CPU timers",
        "Local @Cron decorators are limited to 1 execution per day"
      ],
      correctIndex: 1,
      explanation: "Repeatable jobs manage schedule state centrally via Redis, ensuring only one instance across a scaled cluster executes the scheduled job."
    },
    {
      question: "How can a long-running BullMQ worker update its execution progress percentage for UI monitoring dashboards?",
      options: [
        "By writing raw text to stdout",
        "By calling job.updateProgress(percentage)",
        "By restarting the worker process",
        "By updating PostgreSQL database tables manually"
      ],
      correctIndex: 1,
      explanation: "The \`job.updateProgress()\` method saves progress status (0-100) directly to Redis, emitting progress events for monitoring dashboards."
    },
    {
      question: "What error type should be thrown in a BullMQ worker to halt remaining retry attempts for non-retryable failures?",
      options: [
        "HttpException",
        "UnrecoverableError",
        "FatalTaskException",
        "NullPointerException"
      ],
      correctIndex: 1,
      explanation: "Throwing an \`UnrecoverableError\` tells BullMQ to skip remaining retry attempts and move the job directly to the failed set."
    },
    {
      question: "What setting must be set to 'null' on ioredis client configurations used by BullMQ worker instances?",
      options: [
        "password",
        "maxRetriesPerRequest",
        "enableReadyCheck",
        "port"
      ],
      correctIndex: 1,
      explanation: "BullMQ workers use blocking connections; setting \`maxRetriesPerRequest: null\` is required to prevent ioredis from throwing connection errors while waiting for jobs."
    },
    {
      question: "What option should be passed to queue.add() to schedule a task to run 10 minutes in the future?",
      options: [
        "{ delay: 600000 }",
        "{ timeout: 600000 }",
        "{ repeat: 600000 }",
        "{ expire: 600000 }"
      ],
      correctIndex: 0,
      explanation: "The \`delay\` option specifies execution offset in milliseconds (\`10 * 60 * 1000 = 600000ms\`)."
    },
    {
      question: "How does BullMQ ensure that two workers do not execute the exact same job concurrently?",
      options: [
        "By assigning jobs via round-robin DNS",
        "By executing an atomic Lua script that claims job locks and updates job states in a single thread execution cycle",
        "By using operating system file locks",
        "By shutting down idle worker processes"
      ],
      correctIndex: 1,
      explanation: "BullMQ uses atomic Redis Lua scripts to verify lock availability and shift job states within a single thread execution cycle."
    }
  ],
  project: {
    name: "Advanced Distributed Job Scheduler & Resilience Engine",
    goal: "Build a comprehensive background processing system in NestJS featuring BullMQ lifecycle progress tracking, delayed order expiration timers, multi-instance repeatable cron scheduling, and custom retry policies.",
    brief: "Construct a production-grade background task and scheduling engine in NestJS using BullMQ. Implement an Order Expiration module that schedules delayed cancellation checks, a Recurring Tasks module that manages cluster-safe nightly database cleanups, and a Payment Processor that uses custom backoff policies and UnrecoverableError handlers for non-retryable logical failures.",
    steps: [
      "Configure BullModule.forRootAsync() with Redis options, specifying maxRetriesPerRequest: null for workers.",
      "Build an OrderExpirationService that enqueues delayed jobs (delay: 15 mins) and provides early cancellation controls.",
      "Implement a RecurringTasksService that registers cluster-safe repeatable jobs using cron expressions ('0 0 * * *').",
      "Develop a PaymentProcessor that updates job progress (job.updateProgress()), handles rate-limit retries, and throws UnrecoverableError for invalid customer IDs.",
      "Attach worker event listeners (@OnWorkerEvent) to track completed, failed, and progress events.",
      "Write integration tests validating delayed job removal, cluster-safe repeatable scheduling, and immediate UnrecoverableError failures."
    ],
    acceptance: [
      "Delayed expiration timers are created in Redis and can be cancelled before execution if paid early.",
      "Repeatable jobs register correctly in Redis without creating duplicate schedules on app restarts.",
      "Invalid payload jobs throw UnrecoverableError and transition immediately to the failed state without retrying.",
      "Long-running tasks emit progress updates (0-100%) back to Redis."
    ],
    stretch: [
      "Implement custom backoff strategies that calculate dynamic delays based on exception types.",
      "Expose WebSocket gateways that stream live job progress updates to frontend clients."
    ]
  }
};