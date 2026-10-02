import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_60_LESSONS: LessonDay = {
  day: 60,
  title: "Background Processing Capstone Project",
  totalMinutes: 120,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-60-lesson-1",
      title: "Architecture & Multi-Worker Pipeline Design",
      durationMinutes: 24,
      explanation: `<b>The Multi-Worker Enterprise Architecture</b>

In modern web systems, an API server should perform lightweight HTTP routing, authorization, and fast database mutations—and nothing else. Heavy operational workloads (generating PDF reports, processing video/images, dispatching batch notifications, and sending emails) must be offloaded to an asynchronous background processing pipeline.

This capstone project implements an end-to-end multi-worker pipeline powered by **NestJS**, **BullMQ**, and **Redis**.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   NestJS API Gateway                   │
│         Exposes HTTP Endpoints & Validation DTOs        │
└───────────────────────────┬────────────────────────────┘
                            │ Enqueues Jobs via BullMQ
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Redis Engine (BullMQ)                │
│ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│ │ Email Queue    │ │ Report Queue   │ │ Image Queue  │ │
│ └────────────────┘ └────────────────┘ └──────────────┘ │
└───────────────────────────┬────────────────────────────┘
                            │ Consumed by Specialized Workers
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Email Worker  │   │ Report Worker │   │ Image Worker  │
│ (SMTP / SES)  │   │ (PDF / Data)  │   │ (Sharp / S3)  │
└───────────────┘   └───────────────┘   └───────────────┘
\`\`\`

<b>Key Architectural Requirements</b>

1. <b>Decoupled Dedicated Queues</b>: Rather than funneling all background tasks through a single monolithic queue, we create isolated queues per domain (\`email-queue\`, \`report-queue\`, \`image-queue\`, \`notification-queue\`).
2. <b>Independent Worker Scaling</b>: Image processing (CPU-intensive) can be scaled across 8 worker containers, while email processing (I/O-intensive) runs on 2 high-concurrency containers.
3. <b>Uniform Job Data Contracts</b>: Every job type defines strict, serializable TypeScript interfaces to eliminate runtime payload shape mismatches.
4. <b>Unified Failure Recovery</b>: All queues leverage a shared Dead-Letter Queue (DLQ) strategy and exponential backoff retry configuration.`,
      diagram: `                   CAPSTONE ARCHITECTURE FLOW
                               │
               Client Requests Heavy Report / Media
                               │
                               ▼
                    ┌─────────────────────┐
                    │ NestJS API Gateway  │
                    └──────────┬──────────┘
                               │
              Validates Request & Enqueues Job
              Returns HTTP 202 Accepted (<20ms)
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Redis BullMQ Hub   │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     [email-queue]      [report-queue]     [image-queue]
            │                  │                  │
            ▼                  ▼                  ▼
      Email Worker       Report Worker       Image Worker
     (Dispatch SES)     (Generate PDF)      (Resize Sharp)`,
      codeExample: {
        title: "Code Example",
        code: `// src/common/interfaces/job-payloads.interface.ts

export interface EmailJobPayload {
  userId: string;
  recipientEmail: string;
  template: 'WELCOME' | 'PASSWORD_RESET' | 'WEEKLY_DIGEST';
  data: Record<string, any>;
}

export interface ReportJobPayload {
  reportId: string;
  userId: string;
  type: 'SALES_SUMMARY' | 'AUDIT_LOG';
  startDate: string;
  endDate: string;
}

export interface ImageJobPayload {
  mediaId: string;
  originalFileUrl: string;
  dimensions: Array<{ width: number; height: number }>;
  outputFormat: 'webp' | 'jpeg';
}

export interface NotificationJobPayload {
  userId: string;
  channel: 'PUSH' | 'SMS';
  title: string;
  body: string;
}`,
      },
      keyTakeaways: [
        "Isolate background tasks into domain-specific queues to allow independent scaling and fault isolation.",
        "Return HTTP 202 Accepted immediately upon enqueuing jobs to deliver sub-50ms API response times.",
        "Enforce strict TypeScript interface contracts on all job payloads across producers and workers.",
        "CPU-bound tasks (image manipulation) and I/O-bound tasks (sending email) require different worker concurrency profiles.",
      ],
      commonMistakes: [
        "<b>Using a single queue for both fast and slow tasks.</b> A backlog of 10,000 slow video encoding jobs will starve fast welcome email dispatches if they share the same queue.",
        "<b>Passing large binary data or file buffers in job payloads.</b> Store file references (S3 URLs/keys) in payloads; let workers download source files directly during execution.",
      ],
      quiz: [
        {
          question: "Why should an enterprise background processing system use separate dedicated queues for Emails and Image Processing?",
          options: [
            "Because Redis can only store one queue per host",
            "To allow independent scaling of CPU-intensive workers vs I/O-intensive workers and prevent heavy tasks from starving light ones",
            "Because BullMQ prohibits sending emails",
            "To force NestJS controllers to run synchronously"
          ],
          correctIndex: 1,
          explanation: "Separate queues decouple task domain types, enabling independent scaling and preventing slow or CPU-heavy workloads from delaying fast tasks."
        }
      ]
    },
    {
      id: "day-60-lesson-2",
      title: "Email & Notification Pipeline Integration",
      durationMinutes: 22,
      explanation: `<b>I/O-Bound Background Workers</b>

The **Email & Notification Worker Pipeline** handles high-volume, I/O-bound outbound communications. Because third-party communication APIs (AWS SES, SendGrid, Twilio) enforce rate limits and experience intermittent network dropouts, workers must feature:
1. <b>Rate Limiting Controls</b>: Enforcing maximum requests per second (e.g. max 50 SMS/sec).
2. <b>High Concurrency</b>: Since I/O operations spend most of their execution time waiting for socket network responses, worker concurrency can safely be configured high (e.g. \`concurrency: 10 - 20\`).
3. <b>Progress Reporting</b>: Notifying monitor dashboards as batch email recipient lists are processed.

\`\`\`text
                  EMAIL / NOTIFICATION WORKER
                               │
               Worker Claims 'send-email' Job
                               │
                               ▼
               Validate Recipient Format & Consent
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [Batch Dispatch]                [Network Error]
      Call AWS SES API              Trigger Exponential Backoff
               │                               │
               ▼                               ▼
      Update Progress (100%)          Retry (Attempt N of 5)
\`\`\`

<b>Implementing the Email & Notification Worker</b>

The worker handles both transactional emails and SMS/Push notifications, updating job progress dynamically during multi-recipient dispatch operations.`,
      diagram: `                   NOTIFICATION WORKER PIPELINE
                               │
               Job Payload: { channel: 'PUSH', ... }
                               │
                               ▼
                    ┌─────────────────────┐
                    │ NotificationWorker  │
                    └──────────┬──────────┘
                               │
                 Checks Channel Type via Switch
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
          [Channel == PUSH]           [Channel == SMS]
         Call FCM Push API            Call Twilio API
                 │                           │
                 └─────────────┬─────────────┘
                               │
                      Report job.progress(100)
                      Return Delivery Receipt`,
      codeExample: {
        title: "Code Example",
        code: `// src/workers/email-notification.worker.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';
import { EmailJobPayload, NotificationJobPayload } from '../common/interfaces/job-payloads.interface';

export const COMMUNICATION_QUEUE = 'communication-queue';

@Processor(COMMUNICATION_QUEUE, {
  concurrency: 15, // High concurrency for I/O-bound network calls
  limiter: {
    max: 50, // Maximum 50 dispatches
    duration: 1000, // Per 1000ms (1 second)
  },
})
export class CommunicationWorker extends WorkerHost {
  private readonly logger = new Logger(CommunicationWorker.name);

  async process(job: Job<EmailJobPayload | NotificationJobPayload>): Promise<any> {
    this.logger.log(\`Processing job #\${job.id} (\${job.name})\`);

    switch (job.name) {
      case 'send-email':
        return await this.handleEmail(job as Job<EmailJobPayload>);
      case 'send-notification':
        return await this.handleNotification(job as Job<NotificationJobPayload>);
      default:
        throw new UnrecoverableError(\`Unsupported communication job name: \${job.name}\`);
    }
  }

  private async handleEmail(job: Job<EmailJobPayload>): Promise<{ messageId: string }> {
    const { recipientEmail, template, data } = job.data;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      throw new UnrecoverableError(\`Invalid email address: \${recipientEmail}\`);
    }

    await job.updateProgress(25);
    // Simulate SMTP / AWS SES Dispatch
    this.logger.log(\`Sending \${template} email to \${recipientEmail}\`);
    await this.simulateNetworkDelay(300);

    await job.updateProgress(100);
    return { messageId: \`msg_\${Date.now()}_\${Math.random().toString(36).substring(7)}\` };
  }

  private async handleNotification(job: Job<NotificationJobPayload>): Promise<{ status: string }> {
    const { userId, channel, body } = job.data;
    
    await job.updateProgress(50);
    this.logger.log(\`Dispatching \${channel} notification to user \${userId}: "\${body}"\`);
    await this.simulateNetworkDelay(200);

    await job.updateProgress(100);
    return { status: 'DELIVERED' };
  }

  private simulateNetworkDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(\`Communication Job #\${job.id} failed: \${error.message}\`);
  }
}`,
      },
      keyTakeaways: [
        "I/O-bound workers (emails, push notifications) benefit from higher concurrency settings (\`concurrency: 10-20\`).",
        "Use BullMQ \`limiter\` settings to ensure third-party communication APIs are not overwhelmed.",
        "Throw \`UnrecoverableError\` for invalid recipient inputs to bypass retries and prevent spamming API gateways.",
        "Return structured message delivery receipts from worker methods for auditing.",
      ],
      commonMistakes: [
        "<b>Retrying emails with malformed recipient addresses.</b> Invalid email addresses will never succeed; throw \`UnrecoverableError\` immediately.",
        "<b>Forgetting worker rate limits on third-party channels.</b> Exceeding Twilio or AWS SES quotas triggers account-wide HTTP 429 locks.",
      ],
      quiz: [
        {
          question: "Why can I/O-bound worker processes safely configure higher concurrency limits than CPU-bound worker processes?",
          options: [
            "I/O-bound workers do not use RAM",
            "I/O-bound tasks spend most of their lifecycle waiting for external network sockets, leaving CPU resources available for concurrent threads",
            "CPU-bound tasks execute inside the browser",
            "NestJS prohibits concurrency on CPU workers"
          ],
          correctIndex: 1,
          explanation: "I/O tasks spend significant time waiting for remote network socket responses, allowing a single worker container to handle many concurrent tasks without maxing out CPU cores."
        }
      ]
    },
    {
      id: "day-60-lesson-3",
      title: "Report & Image Processing Pipeline Integration",
      durationMinutes: 25,
      explanation: `<b>CPU-Bound Background Workers</b>

Unlike email dispatchers, **Report Generation & Image Processing Workers** are CPU-bound and memory-intensive:
- **Image Processing**: Resizing, converting to WebP, and compressing high-resolution images maxes out CPU cores.
- **Report Generation**: Aggregate database queries, PDF layout compilation, and file compression consume heavy RAM and CPU cycles.

<b>Configuring CPU Workers Safely</b>

1. <b>Lower Concurrency</b>: Keep concurrency low (\`concurrency: 1 - 2\` per worker process) to prevent CPU starvation and Out-Of-Memory (OOM) host crashes.
2. <b>Dynamic Progress Updates</b>: Report progress sequentially as multi-step image resizing or PDF rendering advances.
3. <b>S3 Offloading</b>: Workers save output artifacts directly to object storage (S3/GCS) and return the resulting public or signed CDN URLs.

\`\`\`text
                  IMAGE PROCESSING PIPELINE
                               │
               Worker Claims 'process-image' Job
                               │
                               ▼
               Download Original File from Storage
                               │
               job.updateProgress(25)
                               │
               Resize & Convert to WebP (Sharp)
                               │
               job.updateProgress(75)
                               │
               Upload Thumbnails to S3 / Storage
                               │
               job.updateProgress(100)
                               │
               Return { thumbnailUrls: [...] }
\`\`\`

<b>Implementing the Report & Image Processing Worker</b>

This worker handles PDF compilation and image thumbnail generation, demonstrating progress updates and error handling for heavy resource tasks.`,
      diagram: `                    REPORT & IMAGE PIPELINE
                               │
                   Job: "generate-pdf-report"
                               │
                               ▼
                    ┌─────────────────────┐
                    │ HeavyResourceWorker │
                    └──────────┬──────────┘
                               │
                 Executes Multi-Step Workload
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
          Query PostgreSQL            Render PDF Layout
          (job.progress 30%)          (job.progress 70%)
                 │                           │
                 └─────────────┬─────────────┘
                               │
                      Upload PDF Artifact to S3
                      Return CDN Download URL`,
      codeExample: {
        title: "Code Example",
        code: `// src/workers/heavy-resource.worker.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';
import { ReportJobPayload, ImageJobPayload } from '../common/interfaces/job-payloads.interface';

export const HEAVY_RESOURCE_QUEUE = 'heavy-resource-queue';

@Processor(HEAVY_RESOURCE_QUEUE, {
  concurrency: 2, // Low concurrency to protect CPU and memory
})
export class HeavyResourceWorker extends WorkerHost {
  private readonly logger = new Logger(HeavyResourceWorker.name);

  async process(job: Job<ReportJobPayload | ImageJobPayload>): Promise<any> {
    this.logger.log(\`Starting CPU-bound task #\${job.id} (\${job.name})\`);

    switch (job.name) {
      case 'generate-pdf-report':
        return await this.handlePdfReport(job as Job<ReportJobPayload>);
      case 'process-image-variants':
        return await this.handleImageVariants(job as Job<ImageJobPayload>);
      default:
        throw new UnrecoverableError(\`Unknown task type: \${job.name}\`);
    }
  }

  private async handlePdfReport(job: Job<ReportJobPayload>): Promise<{ reportUrl: string }> {
    const { reportId, type, startDate, endDate } = job.data;

    // Step 1: Query aggregate data
    await job.updateProgress(20);
    this.logger.log(\`Querying SQL records for report \${reportId} (\${startDate} to \${endDate})\`);
    await this.simulateCpuWork(800);

    // Step 2: Render PDF template
    await job.updateProgress(60);
    this.logger.log(\`Rendering PDF layout for report \${reportId}\`);
    await this.simulateCpuWork(1200);

    // Step 3: Upload to object storage
    await job.updateProgress(90);
    const reportUrl = \`https://cdn.example.com/reports/\${type.toLowerCase()}_\${reportId}.pdf\`;

    await job.updateProgress(100);
    return { reportUrl };
  }

  private async handleImageVariants(job: Job<ImageJobPayload>): Promise<{ variants: string[] }> {
    const { mediaId, dimensions, outputFormat } = job.data;

    await job.updateProgress(20);
    this.logger.log(\`Downloading source image \${mediaId}\`);
    await this.simulateCpuWork(500);

    const generatedUrls: string[] = [];
    let progress = 20;
    const stepIncrement = 70 / dimensions.length;

    for (const dim of dimensions) {
      this.logger.log(\`Resizing \${mediaId} to \${dim.width}x\${dim.height}.\${outputFormat}\`);
      await this.simulateCpuWork(600); // Simulate Sharp image processing
      
      generatedUrls.push(\`https://cdn.example.com/media/\${mediaId}_\${dim.width}x\${dim.height}.\${outputFormat}\`);
      progress += stepIncrement;
      await job.updateProgress(Math.min(95, Math.round(progress)));
    }

    await job.updateProgress(100);
    return { variants: generatedUrls };
  }

  private simulateCpuWork(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(\`CPU Task #\${job.id} completed. Outputs generated: \${JSON.stringify(result)}\`);
  }
}`,
      },
      keyTakeaways: [
        "CPU-bound tasks (PDF generation, image manipulation) require low worker concurrency (\`1 - 2\`) to avoid memory and CPU exhaustion.",
        "Offload output artifacts to object storage (S3/GCS) and return download URLs in the job result object.",
        "Update progress incrementally during multi-step image resizing loops.",
        "Set strict execution timeout limits on heavy jobs to catch memory leaks or infinite loop bugs.",
      ],
      commonMistakes: [
        "<b>Setting high concurrency on CPU-bound image or PDF workers.</b> Processing 20 images simultaneously on a 2-core container triggers OOM (Out-Of-Memory) process crashes.",
        "<b>Returning raw binary file buffers in the job result object.</b> Saving mega-byte buffers in job results bloats Redis memory; return S3 URLs instead.",
      ],
      quiz: [
        {
          question: "What issue occurs if a CPU-intensive worker processing high-resolution image uploads sets concurrency: 20 on a small 1-core cloud container?",
          options: [
            "Redis converts the images into SQL tables",
            "The container experiences extreme CPU starvation and RAM exhaustion, resulting in an OOM process crash",
            "The BullMQ queue switches to WebSocket mode",
            "NestJS automatically deletes the source image"
          ],
          correctIndex: 1,
          explanation: "CPU and memory-bound operations like image processing max out hardware resources quickly. Running 20 concurrent threads on a small container causes high memory usage and OOM crashes."
        }
      ]
    },
    {
      id: "day-60-lesson-4",
      title: "API Gateway Integration & Event Orchestration",
      durationMinutes: 24,
      explanation: `<b>Wiring the NestJS API Gateway to Background Queues</b>

With our worker processors implemented, we build the **NestJS API Gateway Layer**. The Gateway exposes REST endpoints for client applications, validates incoming DTO request payloads, enqueues background jobs, and provides queue status management endpoints.

\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   HTTP REST Clients                    │
└───────────────────────────┬────────────────────────────┘
                            │ POST /api/v1/reports/generate
                            ▼
┌────────────────────────────────────────────────────────┐
│                   ReportsController                    │
│   1. Validates CreateReportDto                         │
│   2. Calls QueueProducer.addReportJob()                │
│   3. Returns HTTP 202 Accepted { jobId: "rep_1001" }   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Job Status Controller                  │
│   GET /api/v1/jobs/rep_1001/status                     │
│   Returns { state: "active", progress: 60 }            │
└────────────────────────────────────────────────────────┘
\`\`\`

<b>Providing Async Job Status Polling</b>

Because background jobs process asynchronously, the API Gateway provides an endpoint for clients to check job status:

\`GET /api/v1/jobs/:queueName/:jobId/status\`

The controller queries BullMQ for the job instance and returns its current state (\`waiting\`, \`active\`, \`completed\`, \`failed\`), progress percentage, and final return value (e.g. S3 download URL).`,
      diagram: `                   ASYNC STATUS POLLING PATTERN
                               │
               1. POST /api/v1/reports
               <-- HTTP 202 Accepted { jobId: "123" }
                               │
               2. Client polls GET /api/v1/jobs/123/status
               <-- HTTP 200 { state: "active", progress: 50% }
                               │
               3. Client polls GET /api/v1/jobs/123/status
               <-- HTTP 200 { state: "completed", result: { url: "..." } }`,
      codeExample: {
        title: "Code Example",
        code: `// src/controllers/job-management.controller.ts
import { Controller, Get, Param, NotFoundException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { COMMUNICATION_QUEUE } from '../workers/email-notification.worker';
import { HEAVY_RESOURCE_QUEUE } from '../workers/heavy-resource.worker';

@Controller('api/v1/jobs')
export class JobManagementController {
  constructor(
    @InjectQueue(COMMUNICATION_QUEUE) private readonly commQueue: Queue,
    @InjectQueue(HEAVY_RESOURCE_QUEUE) private readonly heavyQueue: Queue,
  ) {}

  @Get(':queueName/:jobId/status')
  async getJobStatus(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    const queue = this.resolveQueue(queueName);
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(\`Job #\${jobId} not found in queue '\${queueName}'.\`);
    }

    const state = await job.getState();
    const progress = job.progress;
    const failedReason = job.failedReason;
    const returnvalue = job.returnvalue;

    return {
      jobId: job.id,
      queueName,
      state, // 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
      progress,
      failedReason: state === 'failed' ? failedReason : undefined,
      result: state === 'completed' ? returnvalue : undefined,
      timestamps: {
        created: job.timestamp,
        processed: job.processedOn,
        finished: job.finishedOn,
      },
    };
  }

  private resolveQueue(queueName: string): Queue {
    if (queueName === COMMUNICATION_QUEUE) return this.commQueue;
    if (queueName === HEAVY_RESOURCE_QUEUE) return this.heavyQueue;
    throw new NotFoundException(\`Queue '\${queueName}' does not exist.\`);
  }
}`,
      },
      keyTakeaways: [
        "API controllers enqueue jobs and return HTTP 202 Accepted status codes alongside the generated \`jobId\`.",
        "Expose status polling endpoints (\`/api/v1/jobs/:queue/:id/status\`) so clients can track progress.",
        "Return state metadata, progress percentages, and final result payload objects upon job completion.",
        "Protect status endpoints using authentication guards to ensure users can only inspect their own job status.",
      ],
      commonMistakes: [
        "<b>Returning HTTP 200 OK with no jobId on asynchronous routes.</b> Clients need the \`jobId\` to poll for job completion or listen via WebSockets.",
        "<b>Holding HTTP connections open until the background job finishes.</b> The entire purpose of a queue is to decouple HTTP connections from processing time; return HTTP 202 immediately.",
      ],
      quiz: [
        {
          question: "Which HTTP status code is most appropriate for an API route that validates a request and enqueues a background job for asynchronous processing?",
          options: [
            "200 OK",
            "201 Created",
            "202 Accepted",
            "204 No Content"
          ],
          correctIndex: 2,
          explanation: "HTTP 202 Accepted explicitly indicates that the request has been accepted for processing, but the processing has not been completed."
        }
      ]
    },
    {
      id: "day-60-lesson-5",
      title: "Testing, Observability, and Capstone Verification",
      durationMinutes: 25,
      explanation: `<b>End-to-End Testing & Verification of Queue Pipelines</b>

To guarantee system reliability, we must verify our capstone background processing pipeline using **Automated Integration Tests** and **Bull-Board Observability**.

<b>Testing Strategy for Background Queues</b>

1. <b>Producer Testing</b>: Verify that controllers correctly validate DTO payloads and call \`queue.add()\` with expected options (attempts, backoff, delays).
2. <b>Worker Processing Testing</b>: Instantiate worker processors in an isolated test context, mock external network calls (AWS SES / Twilio / S3), execute \`worker.process(mockJob)\`, and assert progress updates and return values.
3. <b>DLQ Recovery Testing</b>: Simulate persistent network failures, verify that jobs exhaust retries and transition to the failed state, and invoke \`job.retry()\` to assert recovery.

\`\`\`text
                  E2E INTEGRATION TEST FLOW
                               │
          1. Supertest POST /api/v1/reports/generate
             Assert HTTP 202 Accepted & jobId present
                               │
          2. Wait for BullMQ Worker execution
                               │
          3. Query GET /api/v1/jobs/heavy-resource-queue/:jobId/status
             Assert state === 'completed'
             Assert result.reportUrl contains 'https://cdn.example.com/'
\`\`\`

<b>Capstone System Verification Checklist</b>

- [x] **API Gateway**: Validates input DTOs and returns HTTP 202 Accepted in under 50ms.
- [x] **Communication Worker**: Processes emails and notifications with rate limiting and high concurrency.
- [x] **Heavy Resource Worker**: Processes PDF reports and image variants with low concurrency and progress reporting.
- [x] **Fault Tolerance**: Retries transient errors using exponential backoff and captures unrecoverable errors.
- [x] **Observability**: Exposes Bull-Board UI at \`/admin/queues\` for visual health auditing.`,
      diagram: `                    CAPSTONE VERIFICATION FLOW
                               │
                     Execute E2E Test Suite
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
 [Producer Tests]       [Worker Tests]          [DLQ Tests]
 Validate DTOs &        Assert Processors &    Simulate Retries &
 Enqueue Options        Progress Updates       Verify Manual Replay
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    All Tests Passed (100%)
                     Production Ready!`,
      codeExample: {
        title: "Code Example",
        code: `// test/background-pipeline.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Background Processing Pipeline (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/reports/generate - Enqueues report job and returns 202 Accepted', async () => {
    const payload = {
      type: 'SALES_SUMMARY',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    };

    // 1. Dispatch asynchronous report generation request
    const response = await request(app.getHttpServer())
      .post('/api/v1/reports/generate')
      .send(payload)
      .expect(202);

    expect(response.body).toHaveProperty('jobId');
    const jobId = response.body.jobId;

    // 2. Poll job status endpoint until worker completes task
    let completed = false;
    let attempts = 0;

    while (!completed && attempts < 10) {
      await new Promise((res) => setTimeout(res, 500));
      const statusRes = await request(app.getHttpServer())
        .get(\`/api/v1/jobs/heavy-resource-queue/\${jobId}/status\`)
        .expect(200);

      if (statusRes.body.state === 'completed') {
        completed = true;
        expect(statusRes.body.progress).toEqual(100);
        expect(statusRes.body.result).toHaveProperty('reportUrl');
      }
      attempts++;
    }

    expect(completed).toBe(true);
  });
});`,
      },
      keyTakeaways: [
        "Test producers by asserting job options and payload serialization.",
        "Test worker processors in isolation by mocking external network services.",
        "Write E2E tests that poll job status endpoints to verify end-to-end async pipelines.",
        "Utilize Bull-Board dashboards to visually audit queue backlogs and worker states.",
      ],
      commonMistakes: [
        "<b>Not closing Redis connections in afterAll() test hooks.</b> Leaving open Redis sockets causes Jest test runners to hang indefinitely.",
        "<b>Testing background workers with real third-party API credentials during CI/CD runs.</b> Always mock external network dispatches (SES, Twilio, S3) in test suites.",
      ],
      quiz: [
        {
          question: "How should E2E integration tests verify that an asynchronous background job pipeline completes successfully?",
          options: [
            "By waiting indefinitely without assertions",
            "By submitting the initial request, capturing the returned jobId, and polling the status endpoint until state === 'completed'",
            "By checking if the server process terminates",
            "By inspecting raw browser cookies"
          ],
          correctIndex: 1,
          explanation: "In asynchronous testing, the test submits the request to capture the \`jobId\`, then polls the status endpoint until the worker transitions the job state to completed."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "In our capstone background processing architecture, why are Email and Image Processing workloads split into separate queues?",
      options: [
        "Because Redis limits queues to one per database host",
        "To allow independent worker scaling and prevent CPU-heavy tasks from starving fast I/O tasks",
        "Because BullMQ prohibits image uploads",
        "To disable NestJS controller validation"
      ],
      correctIndex: 1,
      explanation: "Isolating task domain types into dedicated queues allows independent worker scaling and prevents slow or CPU-heavy workloads from delaying fast tasks."
    },
    {
      question: "Which HTTP status code should an API controller return after enqueuing an asynchronous job for background execution?",
      options: [
        "200 OK",
        "201 Created",
        "202 Accepted",
        "400 Bad Request"
      ],
      correctIndex: 2,
      explanation: "HTTP 202 Accepted signifies that the request has been received and queued for asynchronous execution."
    },
    {
      question: "Why do CPU-bound workers (such as image resizing) require lower concurrency settings than I/O-bound workers (such as email dispatch)?",
      options: [
        "CPU-bound tasks do not use network sockets",
        "CPU-bound tasks max out CPU cores and RAM quickly, and high concurrency causes container OOM crashes",
        "I/O-bound workers do not support BullMQ",
        "NestJS limits CPU workers to concurrency: 0"
      ],
      correctIndex: 1,
      explanation: "CPU and memory-intensive tasks use significant host hardware resources. Running them with high concurrency triggers host memory exhaustion and OOM crashes."
    },
    {
      question: "What should a worker processor do when it encounters an invalid recipient email address that can never succeed?",
      options: [
        "Throw an UnrecoverableError to bypass remaining retries and move the job directly to the failed set",
        "Retry the job 10 times",
        "Restart the NestJS application container",
        "Delete the Redis queue"
      ],
      correctIndex: 0,
      explanation: "Throwing an \`UnrecoverableError\` stops useless retry attempts, moving the job directly to the failed state."
    },
    {
      question: "How should workers handle file artifacts generated during background tasks (such as resized images or compiled PDFs)?",
      options: [
        "Save the raw binary buffer directly in the job return object in Redis",
        "Upload the artifact to object storage (S3/GCS) and return the resulting CDN/storage URL in the job result",
        "Write the file to the local container file system without backup",
        "Email the binary file to the server administrator"
      ],
      correctIndex: 1,
      explanation: "Offloading files to object storage keeps Redis memory lean and provides clients with permanent, scalable download URLs."
    },
    {
      question: "What information should be returned by a job status polling endpoint GET /api/v1/jobs/:queue/:jobId/status?",
      options: [
        "The server's environment secret keys",
        "The job state, progress percentage, error reason (if failed), and result payload (if completed)",
        "The raw PostgreSQL database connection string",
        "The server's operating system kernel version"
      ],
      correctIndex: 1,
      explanation: "Job status endpoints provide clients with full visibility into job execution state, progress updates, failure reasons, or completed results."
    },
    {
      question: "Why should external services (AWS SES, Twilio, S3) be mocked during automated E2E integration test runs?",
      options: [
        "Because Jest does not support network requests",
        "To prevent tests from consuming real third-party API quotas, incurring costs, or failing due to external network flakiness",
        "Because BullMQ automatically disables network calls during testing",
        "To speed up TypeScript compilation time"
      ],
      correctIndex: 1,
      explanation: "Mocking external network dispatches ensures fast, deterministic test runs without incurring third-party API costs or flakiness."
    }
  ],
  project: {
    name: "Background Processing Capstone Architecture",
    goal: "Build, configure, and verify an end-to-end background processing ecosystem in NestJS complete with decoupled domain queues, isolated worker processors, async status polling endpoints, and E2E integration tests.",
    brief: "Construct a complete background task processing architecture in NestJS powered by BullMQ and Redis. Implement dedicated Communication and Heavy Resource queues. Build high-concurrency Communication workers and low-concurrency Heavy Resource workers with progress reporting. Expose REST API endpoints that enqueue jobs with HTTP 202 Accepted status codes, provide job status polling, and verify the entire system with automated E2E tests.",
    steps: [
      "Bootstrap a modular NestJS project with BullModule.forRootAsync() pointing to a Redis instance.",
      "Register 'communication-queue' and 'heavy-resource-queue' with default job retry options.",
      "Implement CommunicationWorker with concurrency: 15, rate limiters, and progress updates for emails and notifications.",
      "Implement HeavyResourceWorker with concurrency: 2 for processing PDF reports and image thumbnail variants.",
      "Create API controllers exposing POST endpoints for enqueuing jobs (returning HTTP 202 Accepted) and GET status polling endpoints.",
      "Configure Bull-Board dashboard middleware under '/admin/queues' for visual monitoring.",
      "Write comprehensive E2E integration tests using supertest that enqueue jobs, poll status endpoints, and assert job completion."
    ],
    acceptance: [
      "API Gateway enqueues jobs and responds with HTTP 202 Accepted in under 50ms.",
      "Communication and Heavy Resource workers process jobs independently across their respective queues.",
      "Workers report real-time progress updates (0-100%) back to Redis during task execution.",
      "Status polling endpoints return current state, progress percentage, and final result payloads upon completion.",
      "Automated E2E test suite executes and passes cleanly."
    ],
    stretch: [
      "Implement WebSocket gateways using Socket.io to stream real-time job progress directly to frontend clients without polling.",
      "Configure Dead-Letter Queue (DLQ) replay endpoints allowing administrators to re-inject failed jobs from the Bull-Board UI."
    ]
  }
};