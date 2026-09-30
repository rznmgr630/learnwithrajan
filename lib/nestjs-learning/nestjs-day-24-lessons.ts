import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "Lifecycle Events",
  totalMinutes: 125,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nestjs-lifecycle-overview",
      title: "Understanding the NestJS application lifecycle",
      durationMinutes: 16,
      explanation: `A NestJS application does not simply appear when you call \`NestFactory.create()\` and disappear when the process exits. Nest has a <b>lifecycle</b> that describes what happens while modules are being created, initialized, started, destroyed, and shut down.

Understanding this lifecycle becomes extremely important once your application starts talking to databases, Redis, message brokers, external APIs, background workers, scheduled jobs, file systems, or other infrastructure.

Think about a real-world food-delivery platform.

When the application starts, it might need to:

- Connect to PostgreSQL.
- Connect to Redis.
- Register message consumers.
- Load configuration.
- Warm an application cache.
- Verify that required external services are reachable.
- Start background workers.

When the application stops, it may need to:

- Stop accepting new requests.
- Stop consuming new queue messages.
- Finish requests that are already running.
- Finish or safely requeue background jobs.
- Close database connections.
- Close Redis connections.
- Close message-broker connections.
- Flush logs or telemetry.

That is exactly where lifecycle events become useful.

Nest provides several lifecycle hooks:

\`\`\`
Application starts
      |
      v
Module construction
      |
      v
OnModuleInit
      |
      v
All modules initialized
      |
      v
OnApplicationBootstrap
      |
      v
Application starts listening
      |
      |
      |   Application is running
      |
      v
Shutdown signal
      |
      v
OnModuleDestroy
      |
      v
OnApplicationShutdown
      |
      v
Process exits
\`\`\`

The exact behavior depends on how the application is created and whether shutdown hooks are enabled, but this mental model is extremely useful.

<b>Beginner real-world example:</b>

A simple application uses \`OnModuleInit\` to print a message after a service has been initialized.

<b>Intermediate real-world example:</b>

A database service uses \`OnModuleInit\` to establish a database connection and \`OnModuleDestroy\` to close it.

<b>Advanced real-world example:</b>

A Kubernetes-deployed order-processing service uses lifecycle hooks to stop consuming messages, finish active work, close connections, flush telemetry, and then terminate.

The key idea is that lifecycle hooks allow infrastructure code to react to important moments in the application's lifetime rather than forcing everything into \`main.ts\` or arbitrary service methods.`,
      diagram: `                    NestJS Application
                           |
                    NestFactory.create()
                           |
                           v
                  Module construction
                           |
                           v
                    OnModuleInit
                           |
                           v
              All modules initialized
                           |
                           v
              OnApplicationBootstrap
                           |
                           v
                  Application running
                           |
                           |
                    Shutdown signal
                           |
                           v
                  OnModuleDestroy
                           |
                           v
              OnApplicationShutdown
                           |
                           v
                    Process exits`,
      codeExample: {
        title: "Basic lifecycle hook",
        code: `import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    console.log("AppService module initialized");
  }
}`,
      },
      keyTakeaways: [
        "NestJS provides lifecycle hooks for initialization and shutdown.",
        "OnModuleInit is associated with module initialization.",
        "OnApplicationBootstrap runs when the application bootstrap process reaches its bootstrap phase.",
        "OnModuleDestroy is used for cleanup when modules are being destroyed.",
        "OnApplicationShutdown can react to application shutdown signals.",
        "Lifecycle hooks become especially important when external resources are involved.",
        "Graceful shutdown is about stopping safely rather than simply killing the process.",
      ],
      commonMistakes: [
        "<b>Treating startup as just app.listen().</b> Real applications often need initialization work before they should accept traffic.",
        "<b>Opening resources without closing them.</b> Database, Redis, queue, and socket connections should have an intentional shutdown strategy.",
        "<b>Putting infrastructure cleanup inside controllers.</b> Resource cleanup belongs with the resource-owning service or lifecycle layer.",
        "<b>Assuming lifecycle hooks automatically solve every shutdown problem.</b> The application still needs correctly configured shutdown behavior and resource-specific cleanup.",
      ],
      quiz: [
        {
          question: "Why are NestJS lifecycle hooks useful?",
          options: [
            "They allow code to react to application initialization and shutdown stages",
            "They replace controllers",
            "They replace TypeScript",
            "They create database schemas automatically",
          ],
          correctIndex: 0,
          explanation:
            "Lifecycle hooks let modules and providers perform work at important application lifecycle stages.",
        },
        {
          question: "Which lifecycle concept is especially important for database connections?",
          options: [
            "Opening and closing resources",
            "Swagger styling",
            "Route naming",
            "DTO inheritance",
          ],
          correctIndex: 0,
          explanation:
            "External resources need deliberate initialization and cleanup.",
        },
      ],
    },

    {
      id: "on-module-init",
      title: "OnModuleInit and module initialization",
      durationMinutes: 20,
      explanation: `\`OnModuleInit\` is a lifecycle interface that allows a provider or injectable class to run code when its host module has been initialized.

You implement it like this:

\`\`\`ts
@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    // initialization work
  }
}
\`\`\`

This is useful when a service needs to perform initialization after Nest has created its dependencies.

Imagine a \`PaymentsModule\` containing:

\`\`\`
PaymentsModule
   |
   +--> PaymentService
   +--> PaymentRepository
   +--> StripeClient
   +--> PaymentConfig
\`\`\`

Once the module's providers have been initialized, the payment service can perform setup work.

<b>Beginner real-world example:</b>

You have a configuration service that prints which environment the application is using.

<b>Intermediate real-world example:</b>

A cache service connects to Redis during module initialization.

<b>Advanced real-world example:</b>

A search module connects to Elasticsearch, verifies that required indexes exist, and prepares an application-specific search client.

Another useful scenario is validating required configuration.

Suppose an application cannot operate without:

\`\`\`
DATABASE_URL
REDIS_URL
PAYMENT_SECRET
\`\`\`

A startup service can verify that required configuration exists before the application is considered ready.

However, there is an important architectural distinction.

If initialization is critical to the application being usable, failing startup can be appropriate.

For example:

\`\`\`
Database unavailable
       |
       v
Application cannot safely process orders
       |
       v
Fail startup
\`\`\`

But if the dependency is optional, you may want a different strategy.

For example:

\`\`\`
Analytics service unavailable
       |
       v
Application can still process orders
       |
       v
Start application
       |
       v
Retry analytics connection
\`\`\`

<b>Beginner:</b> use the hook to understand when a provider is initialized.

<b>Intermediate:</b> initialize a resource such as Redis or an SDK client.

<b>Advanced:</b> perform dependency validation, resource initialization, cache warming, index verification, or worker setup while carefully deciding whether initialization failure should stop the application.

Do not use \`OnModuleInit\` as a place for arbitrary business operations. It is an application lifecycle hook, not a replacement for your domain services.`,
      diagram: `PaymentsModule
      |
      +--> ConfigService
      |
      +--> PaymentRepository
      |
      +--> PaymentService
              |
              v
        OnModuleInit()
              |
              +--> Validate configuration
              |
              +--> Initialize SDK
              |
              +--> Prepare resources`,
      codeExample: {
        title: "Basic to advanced OnModuleInit",
        code: `import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class RedisService implements OnModuleInit {
  private connected = false;

  async onModuleInit() {
    console.log("Initializing Redis...");

    // A real implementation would connect here.
    await this.connect();

    this.connected = true;

    console.log("Redis initialized");
  }

  private async connect() {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  isConnected() {
    return this.connected;
  }
}`,
      },
      keyTakeaways: [
        "OnModuleInit lets a provider react to module initialization.",
        "It is useful for initializing resources after Nest has created the provider graph.",
        "Database, Redis, SDK, cache, and search initialization are common examples.",
        "Critical initialization failures may justify preventing the application from starting.",
        "Optional dependencies may need retry or degraded-mode strategies instead.",
        "Lifecycle hooks should contain lifecycle concerns rather than ordinary business workflows.",
      ],
      commonMistakes: [
        "<b>Putting order-processing logic inside onModuleInit().</b> Lifecycle initialization is not a substitute for application services.",
        "<b>Starting an infinite background loop without a shutdown strategy.</b> Any worker started during initialization needs a clean way to stop.",
        "<b>Ignoring initialization errors.</b> If the resource is critical, silently continuing can produce a broken application.",
        "<b>Performing extremely slow startup tasks without considering readiness.</b> Long startup operations should be designed intentionally.",
      ],
      quiz: [
        {
          question: "What is `OnModuleInit` primarily used for?",
          options: [
            "Running initialization logic for a module/provider",
            "Handling HTTP responses",
            "Defining database entities",
            "Generating Swagger",
          ],
          correctIndex: 0,
          explanation:
            "OnModuleInit provides a lifecycle point for initialization after the module/provider setup.",
        },
        {
          question: "Which is a realistic use of OnModuleInit?",
          options: [
            "Initializing a Redis client",
            "Rendering a React component",
            "Creating an HTML page",
            "Changing a user's password on every startup",
          ],
          correctIndex: 0,
          explanation:
            "Infrastructure clients are a common use case for module initialization.",
        },
      ],
    },

    {
      id: "on-application-bootstrap",
      title: "OnApplicationBootstrap and application-wide startup",
      durationMinutes: 20,
      explanation: `\`OnApplicationBootstrap\` runs when the Nest application has completed its initialization phase and is entering the application bootstrap phase.

The important distinction is that \`OnModuleInit\` is associated with individual module initialization, while \`OnApplicationBootstrap\` is useful when you care about the application as a whole being initialized.

Imagine a large e-commerce system:

\`\`\`
AppModule
 |
 +--> UsersModule
 +--> OrdersModule
 +--> PaymentsModule
 +--> InventoryModule
 +--> NotificationsModule
\`\`\`

An individual module may use \`OnModuleInit\` to initialize its own resource.

But you might have application-wide work that should happen only after the relevant modules have been initialized.

<b>Beginner real-world example:</b>

Print:

\`\`\`
Application bootstrap completed
\`\`\`

<b>Intermediate real-world example:</b>

Register a set of application-wide event listeners or warm a cache after the application modules have initialized.

<b>Advanced real-world example:</b>

A multi-service application uses application bootstrap to verify that critical infrastructure is available, initialize scheduled jobs, register consumers, or publish a "service ready" signal to an internal orchestration system.

Consider a notification system.

The \`NotificationsModule\` may initialize its connection to RabbitMQ during \`OnModuleInit\`.

Then an application-level bootstrap hook can start consuming messages only after the overall application initialization has completed.

Conceptually:

\`\`\`
NotificationsModule
       |
       +--> connect to RabbitMQ
       |
       v
OnModuleInit complete
       |
       v
Other modules initialize
       |
       v
OnApplicationBootstrap
       |
       +--> start consuming messages
       |
       v
Application ready
\`\`\`

This separation makes the lifecycle intent easier to understand.

<b>OnModuleInit:</b>

"Is my module/provider initialized?"

<b>OnApplicationBootstrap:</b>

"Has the application completed its initialization phase so application-wide startup work can happen?"

One important point: do not confuse application bootstrap with Kubernetes readiness automatically. Kubernetes needs explicit health/readiness behavior if you want orchestration to understand whether the application can receive traffic.`,
      diagram: `Module A
  |
  +--> OnModuleInit

Module B
  |
  +--> OnModuleInit

Module C
  |
  +--> OnModuleInit

        |
        v

Application initialization complete
        |
        v
OnApplicationBootstrap
        |
        +--> Start application-wide workers
        +--> Warm shared cache
        +--> Register listeners
        |
        v
Application ready`,
      codeExample: {
        title: "Application-wide bootstrap work",
        code: `import {
  Injectable,
  OnApplicationBootstrap,
} from "@nestjs/common";

@Injectable()
export class StartupService
  implements OnApplicationBootstrap
{
  async onApplicationBootstrap() {
    console.log("Application bootstrap completed");

    await this.warmCache();
    await this.registerListeners();

    console.log("Application startup tasks completed");
  }

  private async warmCache() {
    console.log("Warming application cache...");
  }

  private async registerListeners() {
    console.log("Registering application listeners...");
  }
}`,
      },
      keyTakeaways: [
        "OnApplicationBootstrap is useful for application-wide startup work.",
        "OnModuleInit focuses on module/provider initialization.",
        "Application bootstrap can be useful after multiple modules have initialized.",
        "Cache warming, listener registration, and worker startup can be application-level concerns.",
        "Readiness for an orchestrator such as Kubernetes is a separate concern that may require explicit health/readiness endpoints.",
      ],
      commonMistakes: [
        "<b>Using OnApplicationBootstrap for every initialization task.</b> Module-specific initialization often belongs in OnModuleInit.",
        "<b>Starting consumers before their required infrastructure is ready.</b> Ensure dependencies are initialized first.",
        "<b>Assuming bootstrap automatically means Kubernetes readiness.</b> Application lifecycle and orchestration readiness are related but not identical.",
        "<b>Making startup dependent on optional third-party services without a reason.</b> Decide whether the dependency is truly critical.",
      ],
      quiz: [
        {
          question: "What is a useful purpose of OnApplicationBootstrap?",
          options: [
            "Application-wide startup work after initialization",
            "Defining DTO validation decorators",
            "Creating database entities",
            "Handling individual HTTP response bodies",
          ],
          correctIndex: 0,
          explanation:
            "OnApplicationBootstrap is useful for application-wide work after the initialization phase.",
        },
        {
          question: "How does it differ conceptually from OnModuleInit?",
          options: [
            "It focuses on application-wide bootstrap rather than one module's initialization",
            "It only works with controllers",
            "It is a database hook",
            "It is a TypeScript compiler feature",
          ],
          correctIndex: 0,
          explanation:
            "OnModuleInit is module/provider-oriented, while OnApplicationBootstrap is application-wide.",
        },
      ],
    },

    {
      id: "on-module-destroy",
      title: "OnModuleDestroy and resource cleanup",
      durationMinutes: 18,
      explanation: `Applications create resources that must eventually be released.

Examples include:

- Database connections.
- Redis connections.
- RabbitMQ channels.
- Kafka consumers.
- WebSocket connections.
- File watchers.
- Timers.
- Background workers.
- External SDK clients.

\`OnModuleDestroy\` provides a lifecycle hook for cleanup associated with a module.

Imagine an application that owns a Redis client.

During startup:

\`\`\`
RedisService
   |
   +--> connect()
\`\`\`

During shutdown:

\`\`\`
RedisService
   |
   +--> disconnect()
\`\`\`

The service owns the resource, so the cleanup naturally belongs with that service.

<b>Beginner real-world example:</b>

A service logs that its module is being destroyed.

<b>Intermediate real-world example:</b>

A Redis service closes its client connection.

<b>Advanced real-world example:</b>

A message-consumer service stops consuming new messages, waits for active message processing to finish, closes the consumer, and then releases the underlying connection.

This is particularly important in worker-based applications.

Suppose a worker is processing a payment:

\`\`\`
Message received
      |
      v
Process payment
      |
      |   shutdown signal arrives
      |
      v
Finish current payment
      |
      v
Stop consuming new messages
      |
      v
Close connection
\`\`\`

If the process is killed immediately, the message may be left in an uncertain state.

Graceful shutdown tries to avoid this.

There is another important distinction:

<b>OnModuleDestroy</b> is about module/provider destruction and cleanup.

<b>OnApplicationShutdown</b> can be used when you need to react to the application shutdown phase and, importantly, receive the shutdown signal type when applicable.

A service can implement both if its responsibilities require both levels of lifecycle behavior.`,
      diagram: `Application shutdown
       |
       v
Module destruction
       |
       v
OnModuleDestroy
       |
       +--> Stop worker
       +--> Close Redis
       +--> Close DB
       +--> Remove timers
       |
       v
Application shutdown phase`,
      codeExample: {
        title: "Closing a Redis-like resource",
        code: `import {
  Injectable,
  OnModuleDestroy,
} from "@nestjs/common";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private client = {
    quit: async () => {
      console.log("Cache connection closed");
    },
  };

  async onModuleDestroy() {
    console.log("Cleaning up CacheService...");

    await this.client.quit();

    console.log("CacheService cleanup complete");
  }
}`,
      },
      keyTakeaways: [
        "OnModuleDestroy is useful for cleanup owned by a module/provider.",
        "Resources opened during startup should have a deliberate cleanup path.",
        "Database, cache, queue, worker, timer, and socket cleanup are common examples.",
        "Long-running workers need to stop accepting new work before the process exits.",
        "Cleanup should be asynchronous when the underlying resource requires asynchronous shutdown.",
      ],
      commonMistakes: [
        "<b>Closing resources abruptly.</b> Some clients need asynchronous shutdown methods.",
        "<b>Starting workers without tracking active work.</b> Graceful shutdown needs to know what is still running.",
        "<b>Using process.exit() immediately.</b> Immediate process termination can prevent cleanup from completing.",
        "<b>Assuming closing one connection is enough.</b> Applications may own several independent resources.",
      ],
      quiz: [
        {
          question: "What is a common use of OnModuleDestroy?",
          options: [
            "Cleaning up resources owned by a module/provider",
            "Generating Swagger schemas",
            "Validating DTOs",
            "Creating HTTP routes",
          ],
          correctIndex: 0,
          explanation:
            "OnModuleDestroy is commonly used to release resources during module destruction.",
        },
        {
          question: "Why should a worker stop accepting new messages before shutdown?",
          options: [
            "To give active work an opportunity to finish safely",
            "To increase CPU usage",
            "To disable TypeScript",
            "To create Swagger documentation",
          ],
          correctIndex: 0,
          explanation:
            "Stopping new work helps the application finish active work before resources are closed.",
        },
      ],
    },

    {
      id: "on-application-shutdown",
      title: "OnApplicationShutdown and shutdown signals",
      durationMinutes: 18,
      explanation: `\`OnApplicationShutdown\` allows a provider to run logic when the Nest application is shutting down.

This hook is particularly useful when your service needs to react to the shutdown signal itself.

A common production scenario is a process running in Kubernetes.

The application receives a termination signal:

\`\`\`
SIGTERM
   |
   v
Application begins shutdown
   |
   v
Stop accepting new work
   |
   v
Finish active work
   |
   v
Close resources
   |
   v
Exit
\`\`\`

A service implementing \`OnApplicationShutdown\` can inspect the signal.

For example:

\`\`\`ts
onApplicationShutdown(signal?: string) {
  console.log("Shutdown signal:", signal);
}
\`\`\`

<b>Beginner real-world example:</b>

Log that the application is shutting down.

<b>Intermediate real-world example:</b>

Flush an in-memory metrics buffer before the application exits.

<b>Advanced real-world example:</b>

A background worker receives SIGTERM, stops consuming new jobs, waits for active jobs, flushes telemetry, closes external connections, and reports shutdown completion.

This is especially important for applications that perform work outside normal HTTP requests.

Imagine an image-processing worker:

\`\`\`
Queue
 |
 +--> Job A
 +--> Job B
 +--> Job C
        |
        v
   Worker process
\`\`\`

If shutdown occurs while Job B is processing, immediately killing the process can cause incomplete work.

Instead:

\`\`\`
SIGTERM
  |
  v
Stop consuming new jobs
  |
  v
Job B finishes
  |
  v
Acknowledge completed job
  |
  v
Close queue connection
  |
  v
Exit
\`\`\`

This is graceful shutdown.

One subtle but important point is that graceful shutdown requires cooperation from the infrastructure you use. Nest can tell your providers that shutdown is happening, but your database driver, queue library, worker code, timers, and external clients all need appropriate cleanup behavior.`,
      diagram: `Operating System
       |
       | SIGTERM
       v
Nest Application
       |
       v
OnApplicationShutdown(signal)
       |
       +--> Stop accepting new work
       |
       +--> Flush telemetry
       |
       +--> Stop workers
       |
       +--> Close resources
       |
       v
Process exits`,
      codeExample: {
        title: "Handling application shutdown",
        code: `import {
  Injectable,
  OnApplicationShutdown,
} from "@nestjs/common";

@Injectable()
export class ShutdownService
  implements OnApplicationShutdown
{
  async onApplicationShutdown(signal?: string) {
    console.log(
      \`Application shutting down because of: \${signal}\`,
    );

    await this.flushMetrics();

    console.log("Shutdown tasks completed");
  }

  private async flushMetrics() {
    console.log("Flushing metrics...");
  }
}`,
      },
      keyTakeaways: [
        "OnApplicationShutdown lets providers react to application shutdown.",
        "The shutdown signal can provide useful context about why termination started.",
        "SIGTERM is common in containerized production environments.",
        "Graceful shutdown should stop new work before closing infrastructure.",
        "Telemetry, queues, workers, and external clients may require explicit shutdown handling.",
      ],
      commonMistakes: [
        "<b>Assuming SIGTERM means immediate death.</b> It commonly gives an application an opportunity to shut down gracefully.",
        "<b>Ignoring active background jobs.</b> Workers need a strategy for work already in progress.",
        "<b>Doing unlimited cleanup work.</b> Orchestrators and process managers generally have termination deadlines.",
        "<b>Calling process.exit() immediately.</b> This can interrupt asynchronous cleanup.",
      ],
      quiz: [
        {
          question: "What can OnApplicationShutdown provide to your application?",
          options: [
            "A lifecycle point for shutdown logic and the shutdown signal",
            "A database schema",
            "A DTO validator",
            "A Swagger controller",
          ],
          correctIndex: 0,
          explanation:
            "OnApplicationShutdown is designed for application shutdown behavior and can receive the signal.",
        },
        {
          question: "Why is SIGTERM important for Kubernetes applications?",
          options: [
            "It can initiate an orderly application termination",
            "It creates a Kubernetes database",
            "It disables HTTP",
            "It automatically closes every third-party connection",
          ],
          correctIndex: 0,
          explanation:
            "Container orchestration commonly uses SIGTERM as part of graceful application termination.",
        },
      ],
    },

    {
      id: "graceful-shutdown",
      title: "Graceful shutdown from HTTP requests to background jobs",
      durationMinutes: 22,
      explanation: `Graceful shutdown means <b>stopping an application in a controlled way instead of abruptly terminating it</b>.

This becomes critical in production because an application may be doing useful work when termination begins.

Imagine an online shopping API.

At 10:00:00, the application receives:

\`\`\`
POST /api/orders
\`\`\`

The request starts processing payment.

At 10:00:01, Kubernetes decides that the pod should be replaced and sends SIGTERM.

A poor shutdown strategy might immediately terminate the process:

\`\`\`
SIGTERM
  |
  v
process.exit()
  |
  v
Payment request interrupted
\`\`\`

That can produce difficult problems:

- The customer may not know whether the payment succeeded.
- The order may be partially created.
- A queue message may not be acknowledged.
- A database transaction may be interrupted.
- Logs may never be flushed.
- Telemetry may be lost.

A graceful strategy is different:

\`\`\`
SIGTERM
   |
   v
Mark application as shutting down
   |
   v
Stop accepting new work
   |
   v
Allow active requests/jobs to finish
   |
   v
Stop workers
   |
   v
Close queues
   |
   v
Close database connections
   |
   v
Flush telemetry/logs
   |
   v
Exit
\`\`\`

<b>Beginner real-world example:</b>

A small API closes its database connection when the process shuts down.

<b>Intermediate real-world example:</b>

A web API stops accepting new background tasks and closes Redis and database connections.

<b>Advanced real-world example:</b>

A Kubernetes order-processing service:

1. Receives SIGTERM.
2. Marks itself unavailable for new traffic.
3. Stops consuming new queue messages.
4. Waits for currently running jobs.
5. Finishes or safely requeues active work.
6. Closes message-broker connections.
7. Closes Redis.
8. Closes the database.
9. Flushes telemetry.
10. Exits before the orchestrator's termination deadline.

There are several moving pieces here.

<b>1. Application shutdown hooks</b>

Nest must know that it should participate in shutdown handling.

\`\`\`ts
app.enableShutdownHooks();
\`\`\`

<b>2. Resource cleanup</b>

Each resource-owning service should know how to close itself.

<b>3. Readiness</b>

A production service should stop being considered ready before it disappears completely so new traffic can be routed elsewhere.

<b>4. Termination deadline</b>

Graceful does not mean "wait forever." The process manager normally has a termination window.

<b>5. Idempotency</b>

Shutdown logic should be safe if cleanup is triggered more than once or if different shutdown paths overlap.

This is especially important for payments, orders, emails, and message processing.

For example, suppose a queue worker processes:

\`\`\`
charge-card
create-order
send-confirmation
\`\`\`

If shutdown occurs after charging the card but before acknowledging the message, the queue may deliver the message again.

That means the business operation should be designed with idempotency in mind.

Graceful shutdown therefore is not only a NestJS lifecycle feature. It is part of a larger distributed-systems design.`,
      diagram: `                   SIGTERM
                      |
                      v
              Shutdown begins
                      |
                      v
            Stop accepting work
                      |
            +---------+---------+
            |                   |
            v                   v
       HTTP requests       Queue workers
       already active     already active
            |                   |
            v                   v
        Finish safely      Finish / requeue
            |                   |
            +---------+---------+
                      |
                      v
              Close infrastructure
                      |
          +-----------+-----------+
          |           |           |
         DB         Redis       Queue
          |           |           |
          +-----------+-----------+
                      |
                      v
               Flush telemetry
                      |
                      v
                  Process exit`,
      codeExample: {
        title: "A graceful shutdown-aware worker",
        code: `import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class OrderWorker
  implements
    OnModuleInit,
    OnModuleDestroy,
    OnApplicationShutdown
{
  private shuttingDown = false;
  private activeJobs = 0;

  async onModuleInit() {
    console.log("Starting order worker");

    // Start consuming messages here.
  }

  async processJob(jobId: string) {
    if (this.shuttingDown) {
      throw new Error("Worker is shutting down");
    }

    this.activeJobs++;

    try {
      console.log(\`Processing job: \${jobId}\`);

      await this.doWork(jobId);

      console.log(\`Completed job: \${jobId}\`);
    } finally {
      this.activeJobs--;
    }
  }

  async onModuleDestroy() {
    console.log("Stopping new jobs...");

    this.shuttingDown = true;

    // Stop consuming new queue messages.
  }

  async onApplicationShutdown(signal?: string) {
    console.log(
      \`Shutdown signal received: \${signal}\`,
    );

    await this.waitForActiveJobs();

    // Close queue connection here.
    console.log("Order worker stopped");
  }

  private async doWork(jobId: string) {
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );
  }

  private async waitForActiveJobs() {
    while (this.activeJobs > 0) {
      console.log(
        \`Waiting for \${this.activeJobs} active job(s)...\`,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 100),
      );
    }
  }
}`,
      },
      keyTakeaways: [
        "Graceful shutdown means terminating the application in a controlled sequence.",
        "New work should stop before infrastructure is closed.",
        "Existing requests and jobs may need time to finish.",
        "Queue consumers should stop accepting new messages before shutdown.",
        "Database, Redis, queue, and telemetry resources should be closed or flushed deliberately.",
        "Graceful shutdown needs a termination deadline.",
        "Idempotent business operations are important when queue messages may be retried.",
        "Graceful shutdown is both an application lifecycle concern and a distributed-systems concern.",
      ],
      commonMistakes: [
        "<b>Calling process.exit() immediately.</b> This can terminate requests and prevent asynchronous cleanup.",
        "<b>Closing the database before active requests finish.</b> Active requests may still need the database.",
        "<b>Stopping the queue connection before active jobs finish.</b> This can interrupt processing.",
        "<b>Waiting forever for a broken job.</b> Shutdown needs a bounded strategy.",
        "<b>Ignoring duplicate message processing.</b> Queue systems can redeliver messages, so important operations should be designed with idempotency in mind.",
        "<b>Assuming Nest alone can make a distributed system graceful.</b> External queues, databases, load balancers, orchestrators, and business operations all participate in the shutdown design.",
      ],
      quiz: [
        {
          question: "What is the main goal of graceful shutdown?",
          options: [
            "Terminate the application in a controlled way while allowing important work to finish safely",
            "Restart the database",
            "Disable validation",
            "Generate Swagger documentation",
          ],
          correctIndex: 0,
          explanation:
            "Graceful shutdown coordinates stopping new work, completing active work where possible, cleaning resources, and then exiting.",
        },
        {
          question: "What should generally happen before closing a queue connection?",
          options: [
            "Stop accepting new jobs and handle active jobs appropriately",
            "Start accepting more jobs",
            "Delete the queue",
            "Disable TypeScript",
          ],
          correctIndex: 0,
          explanation:
            "Workers should stop new work before their infrastructure is closed.",
        },
        {
          question: "Why is idempotency important during graceful shutdown?",
          options: [
            "A queue message may be delivered again if processing and acknowledgement do not complete together",
            "It makes Swagger faster",
            "It replaces database transactions",
            "It disables CORS",
          ],
          correctIndex: 0,
          explanation:
            "Distributed message systems can retry or redeliver work, so important operations should safely handle duplicate attempts.",
        },
      ],
    },

    {
      id: "lifecycle-hooks-together",
      title: "Putting all lifecycle hooks together",
      durationMinutes: 11,
      explanation: `The real value of lifecycle events becomes clearer when you stop thinking about each hook as an isolated feature.

Consider a production notification service.

It owns:

- A Redis connection.
- A PostgreSQL connection.
- A RabbitMQ consumer.
- A metrics buffer.
- A background worker.

Its lifecycle could look like this:

\`\`\`
START
 |
 +--> OnModuleInit
 |       |
 |       +--> Connect Redis
 |       +--> Connect PostgreSQL
 |       +--> Prepare RabbitMQ
 |
 +--> OnApplicationBootstrap
         |
         +--> Start queue consumer
         +--> Warm cache
         +--> Start application-wide jobs
 |
 v
RUNNING
 |
 | SIGTERM
 v
SHUTDOWN
 |
 +--> OnModuleDestroy
 |       |
 |       +--> Stop consuming new jobs
 |       +--> Stop timers
 |
 +--> OnApplicationShutdown
         |
         +--> Wait for active work
         +--> Flush metrics
         +--> Close external resources
 |
 v
EXIT
\`\`\`

The exact division of responsibility depends on the application, but the important architectural idea is that <b>the code that owns a resource should understand how that resource starts and stops</b>.

For example:

\`\`\`
DatabaseService
   |
   +--> OnModuleInit
   |       connect()
   |
   +--> OnModuleDestroy
           disconnect()
\`\`\`

While an application-wide worker might use:

\`\`\`
WorkerService
   |
   +--> OnApplicationBootstrap
   |       start consuming
   |
   +--> OnApplicationShutdown
           stop and drain
\`\`\`

<b>Beginner real-world example:</b>

A service logs startup and shutdown events.

<b>Intermediate real-world example:</b>

A database service connects during initialization and disconnects during destruction.

<b>Advanced real-world example:</b>

A production worker coordinates multiple resources, stops accepting work on shutdown, drains active jobs, flushes metrics, and closes connections before the process exits.

This is the point where lifecycle hooks stop being "framework features" and become part of application architecture.

A well-designed application can answer:

<b>What must happen before this service starts?</b>

<b>What must happen before this application accepts traffic?</b>

<b>What happens when termination begins?</b>

<b>What work must finish?</b>

<b>Which resources must be closed?</b>

<b>What happens if shutdown takes too long?</b>

Those questions are far more important than simply memorizing the hook names.`,
      diagram: `                    STARTUP
                       |
                       v
                OnModuleInit
                       |
          +------------+------------+
          |            |            |
         DB          Redis        Queue
          |            |            |
          +------------+------------+
                       |
                       v
          OnApplicationBootstrap
                       |
                Start workers
                       |
                       v
                    RUNNING
                       |
                     SIGTERM
                       |
                       v
                OnModuleDestroy
                       |
                Stop new work
                       |
                       v
            OnApplicationShutdown
                       |
              Drain + cleanup
                       |
                       v
                     EXIT`,
      codeExample: {
        title: "Complete lifecycle-aware service",
        code: `import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class MessageWorker
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    OnApplicationShutdown
{
  private acceptingJobs = false;
  private activeJobs = 0;

  async onModuleInit() {
    console.log("1. Module initialization");

    // Connect infrastructure.
  }

  async onApplicationBootstrap() {
    console.log("2. Application bootstrap");

    this.acceptingJobs = true;

    // Start consuming messages.
  }

  async onModuleDestroy() {
    console.log("3. Module destruction");

    this.acceptingJobs = false;

    // Stop receiving new messages.
  }

  async onApplicationShutdown(signal?: string) {
    console.log(
      \`4. Application shutdown: \${signal}\`,
    );

    await this.waitForActiveJobs();

    // Close queue/database/etc.
  }

  private async waitForActiveJobs() {
    while (this.activeJobs > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, 100),
      );
    }
  }
}`,
      },
      keyTakeaways: [
        "Lifecycle hooks work best when each hook has a clear responsibility.",
        "OnModuleInit is useful for module/provider initialization.",
        "OnApplicationBootstrap is useful for application-wide startup.",
        "OnModuleDestroy is useful for stopping module-owned resources.",
        "OnApplicationShutdown is useful for shutdown coordination and signal-aware cleanup.",
        "Graceful shutdown requires coordination between application code and infrastructure.",
        "Resource ownership should be clear so startup and cleanup responsibilities are easy to locate.",
      ],
      commonMistakes: [
        "<b>Using every lifecycle hook just because it exists.</b> Choose hooks based on the lifecycle requirement.",
        "<b>Putting all startup work into one giant service.</b> Keep resource ownership close to the resource.",
        "<b>Mixing startup and shutdown responsibilities.</b> Make the lifecycle sequence explicit.",
        "<b>Ignoring the difference between stopping new work and finishing existing work.</b> These are separate shutdown steps.",
      ],
      quiz: [
        {
          question: "Which hook is useful for application-wide startup after module initialization?",
          options: [
            "OnApplicationBootstrap",
            "OnModuleDestroy",
            "OnApplicationShutdown",
            "OnModuleInit only",
          ],
          correctIndex: 0,
          explanation:
            "OnApplicationBootstrap is designed for application-wide bootstrap work.",
        },
        {
          question: "Which hook is useful for module-owned cleanup?",
          options: [
            "OnModuleDestroy",
            "OnApplicationBootstrap",
            "OnModuleInit",
            "ValidationPipe",
          ],
          correctIndex: 0,
          explanation:
            "OnModuleDestroy is a natural place for cleanup associated with a module/provider.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the purpose of NestJS lifecycle hooks?",
      options: [
        "To allow code to react to application initialization and shutdown stages",
        "To replace controllers",
        "To generate TypeScript types",
        "To replace databases",
      ],
      correctIndex: 0,
      explanation:
        "Lifecycle hooks provide controlled points for initialization, bootstrap, destruction, and shutdown behavior.",
    },
    {
      question: "Which interface is commonly used for provider initialization?",
      options: [
        "OnModuleInit",
        "OnModuleDestroy",
        "OnApplicationShutdown",
        "CanActivate",
      ],
      correctIndex: 0,
      explanation:
        "OnModuleInit provides a lifecycle hook for module/provider initialization.",
    },
    {
      question: "Which hook is designed for application-wide bootstrap work?",
      options: [
        "OnApplicationBootstrap",
        "OnModuleDestroy",
        "OnModuleInit only",
        "OnApplicationShutdown",
      ],
      correctIndex: 0,
      explanation:
        "OnApplicationBootstrap runs during the application's bootstrap phase after initialization.",
    },
    {
      question: "Which hook is commonly used to clean up a module-owned resource?",
      options: [
        "OnModuleDestroy",
        "OnApplicationBootstrap",
        "OnModuleInit",
        "CanActivate",
      ],
      correctIndex: 0,
      explanation:
        "OnModuleDestroy is commonly used to release resources owned by a module/provider.",
    },
    {
      question: "Which hook can receive the shutdown signal?",
      options: [
        "OnApplicationShutdown",
        "OnModuleInit",
        "OnApplicationBootstrap",
        "OnModuleDestroy only",
      ],
      correctIndex: 0,
      explanation:
        "OnApplicationShutdown can receive the shutdown signal and perform shutdown-related work.",
    },
    {
      question: "What does graceful shutdown mean?",
      options: [
        "Stopping the application immediately",
        "Stopping new work, allowing appropriate active work to finish, cleaning resources, and then exiting",
        "Restarting the database",
        "Disabling all HTTP routes permanently",
      ],
      correctIndex: 1,
      explanation:
        "Graceful shutdown coordinates termination so important work and cleanup can complete safely.",
    },
    {
      question: "Which method enables Nest shutdown hooks?",
      options: [
        "app.enableShutdownHooks()",
        "app.enableGracefulMode()",
        "app.shutdown()",
        "app.useShutdown()",
      ],
      correctIndex: 0,
      explanation:
        "Nest applications can call enableShutdownHooks() so lifecycle shutdown hooks participate in termination.",
    },
    {
      question: "Why should a database connection be closed during shutdown?",
      options: [
        "To release resources cleanly",
        "To enable Swagger",
        "To validate DTOs",
        "To create a new controller",
      ],
      correctIndex: 0,
      explanation:
        "External connections consume resources and should be closed deliberately.",
    },
    {
      question: "What should a queue worker generally do when graceful shutdown begins?",
      options: [
        "Accept unlimited new jobs",
        "Stop accepting new jobs and handle active jobs appropriately",
        "Delete all queue messages",
        "Immediately kill the process",
      ],
      correctIndex: 1,
      explanation:
        "Stopping new work gives active jobs a chance to finish safely before infrastructure is closed.",
    },
    {
      question: "Why is calling process.exit() immediately dangerous during shutdown?",
      options: [
        "It can interrupt asynchronous cleanup",
        "It creates more database connections",
        "It automatically restarts Nest",
        "It enables CORS",
      ],
      correctIndex: 0,
      explanation:
        "Immediate process termination can prevent cleanup operations from completing.",
    },
    {
      question: "What is a realistic use of OnModuleInit?",
      options: [
        "Connecting to Redis",
        "Rendering a browser component",
        "Generating CSS",
        "Creating Swagger HTML manually",
      ],
      correctIndex: 0,
      explanation:
        "Infrastructure initialization is a common use of OnModuleInit.",
    },
    {
      question: "What is a realistic use of OnApplicationBootstrap?",
      options: [
        "Starting an application-wide worker after initialization",
        "Defining a DTO property",
        "Creating a database entity",
        "Handling a single button click",
      ],
      correctIndex: 0,
      explanation:
        "Application-wide worker startup can be coordinated during application bootstrap.",
    },
    {
      question: "What is a realistic use of OnModuleDestroy?",
      options: [
        "Closing a module-owned Redis connection",
        "Creating a new HTTP route",
        "Generating an OpenAPI schema",
        "Validating a password",
      ],
      correctIndex: 0,
      explanation:
        "Closing module-owned infrastructure is a common destruction task.",
    },
    {
      question: "What is a realistic use of OnApplicationShutdown?",
      options: [
        "Flushing telemetry and waiting for active work",
        "Creating a DTO",
        "Generating a controller",
        "Changing the API prefix",
      ],
      correctIndex: 0,
      explanation:
        "Application shutdown is an appropriate place for final cleanup and shutdown coordination.",
    },
    {
      question: "Why is idempotency important for queue-based applications?",
      options: [
        "A job may be delivered more than once",
        "It makes controllers unnecessary",
        "It replaces authentication",
        "It disables shutdown hooks",
      ],
      correctIndex: 0,
      explanation:
        "Message delivery can be retried, so important operations should safely tolerate duplicate attempts.",
    },
  ],

  project: {
    name: "Graceful order-processing service",
    goal: "Build a NestJS service that demonstrates the complete application lifecycle from startup through graceful shutdown.",
    brief: "Create an order-processing service that initializes infrastructure during startup, begins consuming jobs after application bootstrap, stops accepting new work during shutdown, waits for active jobs, and closes resources safely.",
    steps: [
      "Create an AppModule and an OrderWorker service.",
      "Implement OnModuleInit in the worker.",
      "Simulate connecting to a queue during module initialization.",
      "Create a CacheService that initializes a Redis-like connection.",
      "Implement OnApplicationBootstrap in the worker.",
      "Start simulated queue consumption only after application bootstrap.",
      "Track the number of active jobs.",
      "Create a method that processes an order job asynchronously.",
      "Implement OnModuleDestroy.",
      "Stop accepting new jobs when module destruction begins.",
      "Implement OnApplicationShutdown.",
      "Wait for currently active jobs to finish.",
      "Close the simulated queue connection.",
      "Close the simulated cache connection.",
      "Call app.enableShutdownHooks() in main.ts.",
      "Run the application and send a termination signal.",
      "Observe the order of initialization messages.",
      "Observe the order of shutdown messages.",
      "Test shutdown while a job is actively processing.",
      "Make sure active work can finish before resources are closed.",
    ],
    acceptance: [
      "The application initializes its infrastructure before starting normal work.",
      "OnModuleInit is used for module/provider initialization.",
      "OnApplicationBootstrap is used for application-wide startup behavior.",
      "The worker does not accept new jobs after shutdown begins.",
      "Active jobs are tracked.",
      "OnModuleDestroy performs module-owned shutdown preparation.",
      "OnApplicationShutdown performs final application shutdown coordination.",
      "The worker waits for active jobs before closing its queue connection.",
      "Resources are closed asynchronously.",
      "app.enableShutdownHooks() is enabled.",
      "The application does not immediately call process.exit() to terminate.",
      "The shutdown sequence is visible through logs.",
    ],
    stretch: [
      "Add a simulated PostgreSQL service with OnModuleInit and OnModuleDestroy.",
      "Add a Redis cache with connection and disconnection lifecycle methods.",
      "Add a RabbitMQ-like worker that consumes jobs.",
      "Implement a shutdown timeout so the application does not wait forever.",
      "Requeue jobs that cannot finish before the shutdown deadline.",
      "Add a readiness flag that becomes false when shutdown begins.",
      "Create a health endpoint that reports readiness state.",
      "Add structured lifecycle logs with timestamps.",
      "Track startup duration.",
      "Track shutdown duration.",
      "Add idempotency keys to order-processing jobs.",
      "Simulate SIGTERM and document the complete shutdown sequence.",
      "Run the application inside Docker and test container termination.",
      "Deploy the service to Kubernetes and test pod termination behavior.",
      "Add telemetry flushing during OnApplicationShutdown.",
    ],
  },
};
