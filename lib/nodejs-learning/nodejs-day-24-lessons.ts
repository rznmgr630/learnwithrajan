import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "Background jobs and scheduling",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "why-jobs-leave-the-request",
      title: "Why slow work leaves the request",
      durationMinutes: 11,
      explanation:
        "A request should finish quickly. Work that takes seconds belongs somewhere else.\n\n```javascript\napp.post(\"/signup\", async (request, reply) => {\n  await createUser();      //   50ms\n  await sendEmail();       //  800ms\n  await generatePDF();     // 3000ms\n  await uploadToS3();      // 1500ms\n  return { success: true }; // 5350ms total\n});\n```\n\n---\n\n## Background job\n\n<b>Background job</b> (work scheduled to happen outside the request and response cycle).\n\n```text\nRequest → create user → queue jobs → return\n                                       ↓ later\n                               worker → email, PDF, upload\n```\n\n> The latency is the obvious win and it is not the main one. The important change is that <b>the user's signup no longer fails because your email provider is having a bad afternoon</b>. In the first version, a 500 from the mail API means the account was created and the response said it was not, so the user retries and gets \"email already registered\". Moving the email out makes those two outcomes independent.\n\n---\n\n## What you now owe the user\n\n> This is the part left out of most explanations. Returning immediately means you have <b>promised something you have not done</b>, so you now owe them a way to find out. A 202 with a status URL, a notification when it completes, or a visible state on the record.\n>\n> `{ success: true }` for work that has not happened is worse than the slow version, because the user believes it finished. If your PDF generation fails three times and hits the dead-letter queue, somebody is waiting for a download that will never appear, and nothing told them.\n\n---\n\n## What belongs in a job\n\n```text\nSlow            PDF generation, video encoding, image resizing\nUnreliable      third-party APIs, email, webhooks out\nBursty          CSV import, bulk notifications\nScheduled       reports, cleanup, reminders\nRetryable       anything where trying again later is correct\n```\n\n> The test is <b>whether the caller needs the result to continue</b>. They need their account created, so that stays. They do not need the welcome email in hand, so that goes.\n>\n> And the inverse: do not queue something the caller needs. A \"queue it and poll\" flow for a 200ms operation is a slower, more complex version of doing it inline.\n\n---\n\n## The costs\n\n> Worth naming before the mechanics, because a queue is real infrastructure.\n>\n> <b>Another process to run and deploy.</b> Workers are a second thing that can be down, out of date, or crash-looping, and a queue that nothing consumes looks exactly like a queue that is working until you check its depth.\n>\n> <b>Delivery is at-least-once, not exactly-once.</b> That is the default in every queue worth using, so jobs must tolerate running twice. Day 22's idempotency lesson is a prerequisite here rather than an optional extra.\n>\n> <b>Failure moves out of the user's view.</b> A failed request shows the user an error. A failed job shows nobody anything unless you built something to show it.",
      diagram: `The obvious problem

    POST /signup
      createUser      50ms
      sendEmail      800ms
      generatePDF   3000ms
      uploadToS3    1500ms
      ─────────────────────
                    5350ms

    → queue the last three, return in 50ms.


⚠ But the latency is not the MAIN win

    the important change:

      THE USER'S SIGNUP NO LONGER FAILS BECAUSE
      YOUR EMAIL PROVIDER IS HAVING A BAD
      AFTERNOON.

    in the first version, a 500 from the mail API
    means:

      the account WAS created
      the response said it was NOT
      the user retries
      → "email already registered"

    moving the email out makes those two outcomes
    INDEPENDENT.


⚠⚠ What you now OWE the user

    returning immediately means you PROMISED
    SOMETHING YOU HAVE NOT DONE.

    so you owe them a way to find out:

      a 202 with a status URL
      a notification when it completes
      a visible state on the record

    { success: true } for work that has not
    happened is WORSE than the slow version,
    because the user believes it finished.

    if the PDF fails three times and lands in the
    dead-letter queue, somebody is waiting for a
    download that will never appear, and NOTHING
    TOLD THEM.


What belongs in a job

    SLOW        PDFs · video · image resizing
    UNRELIABLE  third-party APIs · email
                webhooks out
    BURSTY      CSV import · bulk notifications
    SCHEDULED   reports · cleanup · reminders
    RETRYABLE   anything where trying again later
                is correct

    the test: DOES THE CALLER NEED THE RESULT TO
    CONTINUE?

      their account created   → stays
      the welcome email       → goes

    ⚠ and the inverse: do not queue something the
      caller needs.

      "queue it and poll" for a 200ms operation is
      a slower, more complex version of doing it
      inline.


The costs, named before the mechanics

    ANOTHER PROCESS TO RUN AND DEPLOY
      a second thing that can be down, stale or
      crash-looping

      and a queue nothing consumes looks exactly
      like a queue that is working, until you
      check its DEPTH

    DELIVERY IS AT-LEAST-ONCE
      the default in every queue worth using

      → jobs must tolerate running TWICE
      → Day 22's idempotency is a PREREQUISITE,
        not an extra

    FAILURE MOVES OUT OF THE USER'S VIEW
      a failed request shows the user an error

      a failed job shows NOBODY ANYTHING unless
      you built something to show it`,
      codeExample: {
        title: "Moving work out, and telling the user about it",
        code: `// ── ✗ Everything inline ─────────────────────────────────────
app.post("/signup", async (request, reply) => {
  const user = await createUser(db, request.body);
  await sendWelcomeEmail(user);        // 800ms, and third-party
  await generateWelcomePdf(user);      // 3000ms, CPU-bound
  await uploadToS3(pdf);               // 1500ms, third-party
  return reply.code(201).send({ success: true });
});
//
// Two problems, and the second is worse than the latency.
//
// 1. 5.3 seconds. The user thinks it hung.
//
// 2. If sendWelcomeEmail throws, this returns a 500. The user
//    sees "signup failed", retries, and gets "email already in
//    use" from the row that WAS created. Now they cannot sign
//    up and cannot log in, because of an email provider.


// ── ✓ Queue the parts the caller does not need ──────────────
app.post("/signup", {
  schema: { body: signupSchema, response: { 202: signupResponseSchema } },
}, async (request, reply) => {
  const user = await db.transaction(async (tx) => {
    const created = await createUser(tx, request.body);

    // ⚠ Enqueue INSIDE the transaction only if your queue is
    // in the same database (pg-boss). With Redis it cannot be
    // atomic, so the next lesson covers what that means.
    return created;
  });

  await Promise.all([
    emailQueue.add("welcome", { userId: user.id }),
    pdfQueue.add("welcome-pdf", { userId: user.id }),
  ]);

  // 202, not 201-with-success. The account exists; the rest
  // does not yet.
  return reply.code(202).send({
    user: { id: user.id, email: user.email },
    onboarding: {
      status: "processing",
      statusUrl: \`/users/\${user.id}/onboarding\`,
    },
  });
});


// ── ⚠ The part people skip: a way to find out ───────────────
// Without this, a job that dies in the dead-letter queue is a
// user waiting forever for a file, and nobody knows.
//
// Track it on the record, so the state is queryable rather
// than living only in the queue.
//
// users table gains:
//   welcome_email_status   'pending' | 'sent' | 'failed'
//   welcome_pdf_status     'pending' | 'ready' | 'failed'
//   welcome_pdf_key        TEXT

app.get("/users/:id/onboarding", {
  preHandler: authenticate,
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  const [user] = await db
    .select({
      emailStatus: users.welcomeEmailStatus,
      pdfStatus: users.welcomePdfStatus,
      pdfKey: users.welcomePdfKey,
    })
    .from(users)
    .where(and(
      eq(users.id, request.params.id),
      eq(users.id, request.user.id),      // Day 19: ownership
    ));

  if (!user) return reply.code(404).send({ error: "Not found" });

  const done = user.emailStatus !== "pending" && user.pdfStatus !== "pending";

  return {
    status: done ? "complete" : "processing",
    email: user.emailStatus,
    pdf: user.pdfStatus,
    downloadUrl: user.pdfKey ? \`/downloads/\${user.pdfKey}\` : null,
  };
});
//
// And the worker writes those columns, so a failure is visible:
worker.on("failed", async (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // Final failure. Record it where a human or the UI can see.
    await db.update(users)
      .set({ welcomePdfStatus: "failed" })
      .where(eq(users.id, job.data.userId));
    log().error({ err, jobId: job.id, userId: job.data.userId },
      "welcome pdf permanently failed");
  }
});
// Day 21's point: the queue's own failed set is diagnostic and
// gets cleaned up. If a user's experience depends on it, the
// state belongs in your database.


// ── ⚠ And do not queue what the caller needs ────────────────
// ✗ A 200ms operation, queued:
app.post("/orders/:id/total", async (request, reply) => {
  const jobId = await totalsQueue.add("recalculate", { orderId: request.params.id });
  return reply.code(202).send({ jobId, poll: \`/jobs/\${jobId}\` });
});
//
// The client now polls for something that took 200ms. You
// added a queue, a worker, a polling endpoint, a job record
// and a state machine, and made the operation slower and less
// reliable than the await it replaced.
//
// ✓ Do it inline. A queue is for work the caller does not
//   need in order to continue.


// ── The decision, per operation ─────────────────────────────
//   operation              caller needs it?   where
//   ────────────────────────────────────────────────────────
//   create the user        yes                inline
//   hash the password      yes                inline (Day 18)
//   send welcome email     no                 queue
//   generate the PDF       no                 queue
//   charge the card        YES                inline
//     ↳ the user is waiting to know if payment worked, and
//       Day 22's idempotency applies either way
//   send the receipt       no                 queue
//   update a search index  no                 queue
//   recalculate a total    yes                inline
//
// The interesting row is the charge. It is slow and it is
// third-party, which looks like a job, and the user genuinely
// needs the answer. Queue the receipt, not the charge.`,
      },
      keyTakeaways: [
        "The latency saving is the obvious win. The bigger one is that signup no longer fails because a third-party email provider did.",
        "Inline third-party work creates the worst failure: the row was created, the response said it failed, and the retry says \"already registered\".",
        "Returning immediately means you promised something you have not done, so you owe the user a way to find out.",
        "`{ success: true }` for work that has not happened is worse than the slow version, because the user believes it finished.",
        "Track job outcomes on the record, not only in the queue, so a permanently failed job is visible to the user and to you.",
        "The test for queueing something is whether the caller needs the result to continue.",
        "Do not queue what the caller needs. \"Queue it and poll\" for a 200ms operation is slower and more complex than the `await` it replaced.",
        "A queue is another process to run, deploy and monitor, and one that nothing consumes looks like one that is working.",
        "Delivery is at-least-once in every queue worth using, so Day 22's idempotency is a prerequisite rather than an extra.",
        "Failure moves out of the user's view, so a failed job shows nobody anything unless you build something to show it.",
      ],
      commonMistakes: [
        "Awaiting a third-party call in a signup handler, so their outage becomes your registration failure with a half-created account.",
        "Returning `{ success: true }` for queued work, so the user believes something happened that has not.",
        "No status endpoint or record state, so a job that lands in the dead-letter queue leaves somebody waiting forever.",
        "Keeping the outcome only in the queue's failed set, which is diagnostic and gets pruned.",
        "Queueing an operation the caller needs, which adds a polling loop to something that took 200ms.",
        "Queueing the card charge and returning 202, so the user does not know whether they paid.",
        "Treating a queue as free, when it is a second deployable that can be down or crash-looping.",
        "Assuming exactly-once delivery, which no queue you should use provides.",
      ],
      quiz: [
        {
          question: "What is the bigger benefit of moving an email out of a signup request?",
          options: [
            "The 800ms saving",
            "Signup stops failing because of the email provider. Inline, a 500 leaves a created account with a failed response and a retry that says \"already registered\".",
            "Fewer database queries",
            "Better logs",
          ],
          correctIndex: 1,
          explanation:
            "The latency is visible and the coupled failure is the one that leaves a user unable to sign up or log in.",
        },
        {
          question: "What do you owe the user after returning immediately?",
          options: [
            "Nothing, the work is queued",
            "A way to find out what happened: a status URL, a notification, or a visible state on the record",
            "A faster response next time",
            "A retry endpoint",
          ],
          correctIndex: 1,
          explanation:
            "`{ success: true }` for work that has not happened is worse than the slow version, because the user believes it finished.",
        },
        {
          question: "What is the test for whether something belongs in a job?",
          options: [
            "Is it slower than one second?",
            "Does the caller need the result in order to continue?",
            "Does it call a third party?",
            "Can it fail?",
          ],
          correctIndex: 1,
          explanation:
            "They need the account created, so that stays inline. They do not need the welcome email in hand, so that goes.",
        },
        {
          question: "Why should the job outcome be recorded on the record rather than only in the queue?",
          options: [
            "Queues are slow to query",
            "The queue's failed set is diagnostic and gets pruned, so a permanently failed job would leave the user waiting with nothing to show them",
            "Queues cannot store state",
            "For auditing only",
          ],
          correctIndex: 1,
          explanation:
            "Day 21's distinction: diagnostic data is not the same as state a user's experience depends on.",
        },
        {
          question: "Why not queue a 200ms operation the caller is waiting for?",
          options: [
            "Queues have a minimum delay",
            "You add a worker, a polling endpoint and a state machine, and make the operation slower and less reliable than the `await` it replaced",
            "It would be idempotent",
            "Redis cannot handle it",
          ],
          correctIndex: 1,
          explanation:
            "A queue is for work the caller does not need in order to continue. Otherwise inline is both simpler and faster.",
        },
      ],
    },
    {
      id: "queues-jobs-workers",
      title: "Queues, jobs and workers",
      durationMinutes: 12,
      explanation:
        "Three terms that get used interchangeably and are not.\n\n```text\nQueue    where jobs wait\nJob      one unit of work, with its data\nWorker   a process that takes jobs and runs them\n```\n\n> The one that matters architecturally is that a <b>worker is a separate process</b>. Not a function in your API, not a `setInterval`: a second deployable that can be scaled, restarted and crash independently. That separation is the whole point, and it is also the thing people skip, which is how you end up with a \"queue\" that runs inside your web server and shares its event loop.\n\n---\n\n## BullMQ\n\n<b>BullMQ</b> (a Redis-backed job queue for Node).\n\n```text\nAPI → BullMQ → Redis → Worker A, Worker B\n```\n\nIt provides retries, backoff, delays, priorities, concurrency, rate limiting, repeatable jobs and a failed set.\n\n> Note what this depends on. Day 23's warning applies directly: if that Redis has `allkeys-lru` eviction, your <b>jobs are evictable</b>. A cache entry disappearing is a miss; a job disappearing is work that silently never happens. Jobs belong in a Redis with no eviction policy, and ideally not the one holding your cache.\n\n---\n\n## pg-boss and Graphile Worker\n\n<b>pg-boss</b> (a job queue that stores jobs in PostgreSQL).\n\n> The reason to consider it is not fewer dependencies, it is <b>transactional enqueue</b>. With Redis you cannot atomically commit a database change and enqueue a job, so you get one of two bugs: commit then enqueue, and a crash between them loses the job; enqueue then commit, and a rollback leaves a job referencing a row that does not exist.\n>\n> With the queue in the same database, `INSERT INTO job` is part of your transaction, and that whole class of problem disappears. That is a genuine correctness advantage, and it costs you Postgres doing queue work.\n\n---\n\n## The gap you have to handle with Redis\n\n> If you use Redis, pick your failure and handle it. <b>Commit first, then enqueue</b> is usually right, because a lost job is recoverable by a sweep and a job for a nonexistent row is a confusing hard failure.\n>\n> Then add the sweep: a periodic query for rows in a pending state older than a few minutes, which re-enqueues them. That is the <b>transactional outbox</b> pattern in its simplest form, and it is the honest cost of a Redis queue next to a SQL database.\n\n---\n\n## Job data\n\n> Put <b>identifiers</b> in the job, not objects. `{ userId: 8811 }` rather than the whole user.\n>\n> Three reasons. The payload is serialised, so Day 23's `Date`-becomes-a-string problem applies exactly. The data is a snapshot from enqueue time, so a job that runs two minutes later acts on stale values. And a large payload multiplied by a deep queue is real memory in Redis.\n>\n> The worker reloads by id and sees current data, which is almost always what you wanted.",
      diagram: `Three terms, used interchangeably, not the same

    QUEUE    where jobs wait
    JOB      one unit of work, with its data
    WORKER   a process that takes jobs and runs
             them


⚠ The one that matters: A WORKER IS A SEPARATE
  PROCESS

    not a function in your API.
    not a setInterval.

    a SECOND DEPLOYABLE that can be scaled,
    restarted and crash independently.

    that separation IS the point, and it is the
    thing people skip, which is how you get a
    "queue" running inside your web server,
    sharing its event loop.


BullMQ: Redis-backed

    API → BullMQ → Redis → Worker A, Worker B

    retries · backoff · delays · priorities
    concurrency · rate limiting
    repeatable jobs · a failed set

    ⚠ Day 23 applies directly:

      if that Redis has allkeys-lru eviction,
      YOUR JOBS ARE EVICTABLE.

      a cache entry disappearing is a MISS.
      a job disappearing is WORK THAT SILENTLY
      NEVER HAPPENS.

      → jobs belong in a Redis with NO eviction
        policy, and ideally not the one holding
        your cache.


pg-boss: the real argument is TRANSACTIONAL
         ENQUEUE

    not "fewer dependencies".

    with REDIS you cannot atomically commit a
    database change and enqueue a job, so you pick
    a bug:

      commit then enqueue
        → a crash between them LOSES THE JOB

      enqueue then commit
        → a rollback leaves a job referencing A
          ROW THAT DOES NOT EXIST

    with the queue IN THE SAME DATABASE,
    INSERT INTO job is part of your transaction,
    and the whole class disappears.

    a genuine correctness advantage, costing you
    Postgres doing queue work.


With Redis: pick your failure and handle it

    COMMIT FIRST, THEN ENQUEUE is usually right:

      a lost job is recoverable by a sweep
      a job for a nonexistent row is a confusing
        hard failure

    then ADD THE SWEEP:

      a periodic query for rows in a pending state
      older than a few minutes, re-enqueued

    that is the TRANSACTIONAL OUTBOX pattern in
    its simplest form, and it is the honest cost
    of a Redis queue beside a SQL database.


Job data: IDENTIFIERS, not objects

    { userId: 8811 }     not the whole user

    three reasons:

      the payload is SERIALISED, so Day 23's
      Date-becomes-a-string problem applies
      exactly

      the data is a SNAPSHOT from enqueue time, so
      a job running two minutes later acts on
      STALE values

      a large payload × a deep queue is real
      memory in Redis

    the worker reloads by id and sees CURRENT
    data, which is almost always what you wanted.`,
      codeExample: {
        title: "A queue, a worker, and the enqueue gap",
        code: `// ── src/queues/index.js — shared definitions ────────────────
import { Queue } from "bullmq";

// ⚠ Day 23: a SEPARATE Redis, or at minimum a separate
// database with NO eviction policy. An evicted job is work
// that silently never happens.
const connection = {
  url: config.redis.jobsUrl,      // not config.redis.cacheUrl
  maxRetriesPerRequest: null,     // BullMQ requires this
};

export const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600 },
    //             ^^^^^^^^^^^^^^^^^^^ keep failures for a
    //             week. The default prunes them, and a failed
    //             job you cannot inspect is a failure you
    //             cannot fix.
  },
});


// ── ✓ Enqueue identifiers, not objects ──────────────────────
// ✗
await emailQueue.add("welcome", { user });
//                                ^^^^ the whole row
//
// Three problems:
//   user.createdAt is a Date, and Day 23 verified it comes
//     back as a string, so the worker gets a different shape
//   the values are a SNAPSHOT. If the user changes their
//     email in the two minutes before this runs, you email
//     the old address.
//   a 2KB payload × 100,000 queued jobs is 200MB in Redis

// ✓
await emailQueue.add("welcome", { userId: user.id });


// ── src/workers/email.js — a SEPARATE process ───────────────
import { Worker } from "bullmq";

const worker = new Worker("email", async (job) => {
  // Reload by id, so the worker sees current data.
  const [user] = await db.select().from(users)
    .where(eq(users.id, job.data.userId));

  if (!user) {
    // The row is gone. Not an error worth retrying five times.
    log().warn({ jobId: job.id, userId: job.data.userId },
      "user no longer exists, dropping job");
    return;
  }

  await sendWelcomeEmail(user);

  await db.update(users)
    .set({ welcomeEmailStatus: "sent" })
    .where(eq(users.id, user.id));
}, {
  connection,
  concurrency: 5,
});

// package.json
//   "start:api":    "node --env-file=.env src/server.js"
//   "start:worker": "node --env-file=.env src/workers/email.js"
//
// Two commands, two deployables, two things to monitor. That
// is the cost and it is also the point: a worker stuck on a
// slow email cannot slow down your API, because it is not in
// your API's event loop.
//
// ✗ What people do instead:
//
//   // server.js
//   new Worker("email", handler, { connection });
//
// Now the worker shares the API's process. Day 18's thread
// pool and Day 19's event loop lessons both apply: a CPU-bound
// job blocks your requests, and you cannot scale workers
// without scaling web servers.


// ── ⚠⚠ The enqueue gap, and it is not theoretical ───────────
// With Redis, these two cannot be atomic.

// ✗ Enqueue first:
await emailQueue.add("welcome", { userId: 999 });
await db.transaction(async (tx) => {
  await tx.insert(users).values({ ... });
  throw new Error("validation failed later in the transaction");
});
//
// The transaction rolled back. The job is queued. The worker
// runs, looks up user 999, and finds nothing. Best case that
// is the warn-and-drop above; worst case it retries five times
// with backoff first.

// ✗ Commit first, and crash in between:
const user = await db.transaction(async (tx) => {
  return tx.insert(users).values({ ... }).returning();
});
// ← process killed here by a deploy, an OOM, or Day 22's
//   uncaught exception
await emailQueue.add("welcome", { userId: user.id });
//
// The user exists and will never receive a welcome email.
// Nothing errored. Nothing is in the failed set, because the
// job was never created.

// ✓ Commit first, and add a sweep. This is the honest answer.
export async function sweepPendingWelcomes(db, queue) {
  const stuck = await db
    .select({ id: users.id })
    .from(users)
    .where(and(
      eq(users.welcomeEmailStatus, "pending"),
      lt(users.createdAt, new Date(Date.now() - 5 * 60_000)),
    ))
    .limit(500);

  for (const row of stuck) {
    await queue.add("welcome", { userId: row.id }, {
      jobId: \`welcome:\${row.id}\`,
      //     ^^^^^^^^^^^^^^^^^^^ BullMQ deduplicates by jobId,
      //     so a sweep running alongside the normal path
      //     cannot create a second job
    });
  }

  if (stuck.length) {
    log().warn({ count: stuck.length }, "re-enqueued stuck welcome emails");
    // Worth alerting on. A nonzero count here means the
    // enqueue gap is being hit, which is information.
  }
}
// This is the transactional outbox pattern in its simplest
// form: the database row IS the record that work is owed, and
// the sweep reconciles it against the queue.


// ── ✓ Or use pg-boss and skip the whole problem ─────────────
import PgBoss from "pg-boss";
const boss = new PgBoss({ connectionString: config.database.url });
await boss.start();

await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({ ... }).returning();

  // The job insert is part of THIS transaction. Roll back and
  // the job never existed; commit and the job definitely does.
  await boss.send("welcome", { userId: user.id }, { db: tx });

  return user;
});
//
// No gap, no sweep, no reconciliation. That is the actual
// argument for a Postgres-backed queue, and it is worth more
// than "one less service to run".
//
// The trade: your database now does queue polling, which at
// high job volume is load you would rather put on Redis. The
// crossover is much higher than people assume, so start here
// unless you know you are past it.`,
      },
      keyTakeaways: [
        "A worker is a separate process, not a function in your API. That separation is the point, and skipping it puts job work on your API's event loop.",
        "BullMQ gives you retries, backoff, delays, priorities, concurrency, rate limits and repeatable jobs, backed by Redis.",
        "Day 23's eviction warning applies with force: an evicted job is work that silently never happens. Jobs need a Redis with no eviction policy.",
        "Keep failed jobs. The default prunes them, and a failure you cannot inspect is a failure you cannot fix.",
        "The real argument for pg-boss is transactional enqueue, not fewer dependencies.",
        "With Redis you cannot atomically commit and enqueue, so you choose between losing a job on a crash and enqueueing a job for a rolled-back row.",
        "Commit first is usually right, because a lost job is recoverable by a sweep and a job for a missing row is a confusing hard failure.",
        "Add the sweep: a periodic query for rows stuck in a pending state, re-enqueued with a deterministic `jobId` so it cannot duplicate.",
        "That is the transactional outbox pattern, and it is the honest cost of a Redis queue beside a SQL database.",
        "A nonzero sweep count is information worth alerting on, because it means the gap is being hit.",
        "Put identifiers in job data, not objects: serialisation changes the shape, the values are a snapshot, and payload times depth is real memory.",
      ],
      commonMistakes: [
        "Creating the worker inside the API process, so a CPU-bound job blocks requests and workers cannot scale independently.",
        "Running jobs in the same Redis as a cache with `allkeys-lru`, where a job can be evicted and silently never run.",
        "Leaving `removeOnFail` at its default, so failed jobs are pruned before anyone looks at them.",
        "Enqueueing before committing, so a rollback leaves a job pointing at a row that does not exist.",
        "Committing then enqueueing with no sweep, so a crash between them loses the work with no error anywhere.",
        "Not deduplicating the sweep's enqueue, so a recovered job runs twice.",
        "Putting whole objects in job data, which breaks on serialisation, acts on stale values, and grows Redis memory with queue depth.",
        "Choosing Redis over Postgres for a queue on \"fewer moving parts\" grounds without weighing the transactional enqueue you give up.",
      ],
      quiz: [
        {
          question: "Why does it matter that a worker is a separate process?",
          options: [
            "For code organisation",
            "It can be scaled, restarted and crash independently, and job work does not share the API's event loop",
            "Redis requires it",
            "For better logging",
          ],
          correctIndex: 1,
          explanation:
            "Creating the worker inside `server.js` means a CPU-bound job blocks requests and you cannot scale workers without scaling web servers.",
        },
        {
          question: "What is the real argument for a Postgres-backed queue?",
          options: [
            "One fewer service to run",
            "Transactional enqueue: the job insert is part of your transaction, so there is no gap between committing and enqueueing",
            "It is faster",
            "Better tooling",
          ],
          correctIndex: 1,
          explanation:
            "With Redis you must choose between losing a job on a crash and enqueueing one for a rolled-back row.",
        },
        {
          question: "With a Redis queue, which order should you use and what does it require?",
          options: [
            "Enqueue first, no extra work",
            "Commit first, plus a sweep for rows stuck in a pending state, because a crash between the two loses the job silently",
            "Either order is fine",
            "Use a distributed lock",
          ],
          correctIndex: 1,
          explanation:
            "A job for a nonexistent row is a confusing hard failure; a lost job is recoverable. Deduplicate the sweep with a deterministic `jobId`.",
        },
        {
          question: "Why put identifiers rather than objects in job data?",
          options: [
            "Redis rejects large values",
            "Serialisation changes the shape, the values are a snapshot from enqueue time, and payload size times queue depth is real memory",
            "Objects cannot be serialised",
            "It is faster to parse",
          ],
          correctIndex: 1,
          explanation:
            "The worker reloads by id and sees current data, which is usually what you wanted anyway.",
        },
        {
          question: "Why must a jobs Redis have no eviction policy?",
          options: [
            "Performance",
            "An evicted job is work that silently never happens, unlike an evicted cache entry which is just a miss",
            "BullMQ requires it",
            "Jobs are large",
          ],
          correctIndex: 1,
          explanation:
            "Day 23's point again, with a worse consequence. Keep jobs out of the Redis that holds your cache.",
        },
      ],
    },
    {
      id: "retries-backoff-dlq",
      title: "Retries, backoff and the dead-letter queue",
      durationMinutes: 11,
      explanation:
        "## Retry\n\n<b>Retry</b> (running a failed job again).\n\n```text\nAttempt 1 ❌ → Attempt 2 ❌ → Attempt 3 ✅\n```\n\n> Day 22 established the rule and it applies unchanged: retry what <b>might</b> succeed, not what cannot. A malformed payload will be malformed on the fifth attempt too, and retrying it five times with backoff turns one bad message into five failures across twenty minutes, which is worse than one.\n>\n> The queue difference is that <b>it retries by default</b>. Your job function throwing is a retry, so an error you meant as \"this will never work\" becomes five attempts unless you say otherwise.\n\n---\n\n## Distinguishing the two\n\n> Give your job function two exits. Throw for something worth retrying, and <b>return</b> after recording the failure for something that is not.\n>\n> A missing row, a validation failure or a 4xx from a third party are permanent: log them, mark the record, and return successfully. A timeout, a 503 or a connection reset are transient: throw, and let the queue handle it.\n>\n> That distinction is what stops your failed set filling with jobs nobody will ever fix.\n\n---\n\n## Backoff\n\n<b>Backoff</b> (waiting longer between attempts).\n\n```text\n1s → 2s → 4s → 8s → 16s\n```\n\n> Day 22's jitter measurement applies here too, and the queue case is worse in one specific way: <b>many jobs fail at the same moment</b>. When a provider goes down, a thousand queued jobs all fail within seconds and all schedule their retry for exactly the same time. Without jitter you have built a synchronised retry wave aimed at a service that is already down.\n>\n> BullMQ's exponential backoff does not add jitter by default, so a custom backoff strategy is worth the five lines.\n\n---\n\n## Dead-letter queue\n\n<b>Dead-letter queue</b> (where a job goes after exhausting its retries, so it is not lost).\n\n```text\nAttempt 1 ❌ → 2 ❌ → 3 ❌ → attempts exhausted → DLQ\n```\n\n> BullMQ calls this the <b>failed set</b> rather than a separate queue, and the distinction matters operationally: it is a list you have to look at, not a queue something consumes.\n>\n> Which is the real point. A dead-letter queue nobody reads is a slower way of losing the job. It needs three things: a <b>metric</b> so you know its size, an <b>alert</b> when it grows, and a <b>way to replay</b> a job after you fix the cause. Without the third, your only options are to fix it by hand or to leave it.\n\n---\n\n## Stalled jobs\n\n> The failure that is easy to miss. If a worker crashes mid-job, the job is neither complete nor failed: it is <b>active with nobody working on it</b>. BullMQ detects this after a lock expires and returns the job to the queue.\n>\n> Two consequences. Your job runs twice, which is the next lesson. And a job that is genuinely slower than the lock duration gets re-run <b>while the first attempt is still going</b>, which is Day 23's lock-TTL problem in a new place: the fix is to extend the lock while working, not to hope.",
      diagram: `Retry: Day 22's rule, unchanged

    retry what MIGHT succeed, not what cannot.

    a malformed payload will still be malformed on
    the fifth attempt.

    ⚠ the queue difference: IT RETRIES BY DEFAULT.

      your job function throwing IS a retry

      so an error you meant as "this will never
      work" becomes five attempts unless you say
      otherwise


Two exits for a job function

    THROW      something worth retrying
               timeout · 503 · connection reset

    RETURN     something permanent, after
               recording it
               missing row · validation failure
               4xx from a third party

    that distinction is what stops your failed set
    filling with jobs NOBODY WILL EVER FIX.


⚠⚠ Backoff, and why the queue case is worse

    1s → 2s → 4s → 8s → 16s

    Day 22's jitter measurement applies, and here
    it is worse in one specific way:

      MANY JOBS FAIL AT THE SAME MOMENT.

      a provider goes down
      a thousand queued jobs fail within seconds
      all schedule their retry for THE SAME TIME

    → a synchronised retry wave aimed at a service
      that is already down

    and BullMQ's exponential backoff does NOT add
    jitter by default, so a custom strategy is
    worth five lines.


Dead-letter queue

    attempts exhausted → DLQ

    ⚠ BullMQ calls it the FAILED SET, not a
      separate queue, and the difference is
      operational:

        it is a LIST YOU HAVE TO LOOK AT
        not a queue something consumes

    → a DLQ nobody reads is a slower way of
      LOSING the job.

    it needs three things:

      a METRIC, so you know its size
      an ALERT when it grows
      a WAY TO REPLAY after you fix the cause

    without the third, your options are to fix it
    by hand or leave it.


⚠ Stalled jobs: the failure easy to miss

    a worker crashes mid-job.

    the job is neither COMPLETE nor FAILED.

    it is ACTIVE WITH NOBODY WORKING ON IT.

    BullMQ detects this after a lock expires and
    returns the job to the queue.

    two consequences:

      1. YOUR JOB RUNS TWICE
         → next lesson

      2. a job genuinely SLOWER than the lock
         duration gets re-run WHILE THE FIRST
         ATTEMPT IS STILL GOING

         → Day 23's lock-TTL problem in a new
           place

         fix: EXTEND THE LOCK while working, not
         hope`,
      codeExample: {
        title: "Two exits, jittered backoff, and a replayable DLQ",
        code: `import { Worker, UnrecoverableError } from "bullmq";

// ── ✓ Two exits: throw to retry, return to stop ─────────────
const worker = new Worker("email", async (job) => {
  const [user] = await db.select().from(users)
    .where(eq(users.id, job.data.userId));

  // PERMANENT. The row is gone; five attempts will not bring
  // it back. Record and return.
  if (!user) {
    log().warn({ jobId: job.id, userId: job.data.userId },
      "user gone, dropping job");
    return { skipped: "user_deleted" };
  }

  // PERMANENT. A bad address is bad on every attempt.
  if (!isDeliverable(user.email)) {
    await db.update(users)
      .set({ welcomeEmailStatus: "failed", welcomeEmailError: "undeliverable" })
      .where(eq(users.id, user.id));
    return { skipped: "undeliverable" };
  }

  try {
    await sendWelcomeEmail(user);
  } catch (err) {
    // Day 22's classification, reused verbatim.
    if (err.status && err.status >= 400 && err.status < 500) {
      // The provider rejected the request itself. Retrying
      // sends the same invalid request four more times.
      log().error({ err, jobId: job.id }, "provider rejected email");
      await db.update(users)
        .set({ welcomeEmailStatus: "failed", welcomeEmailError: err.message })
        .where(eq(users.id, user.id));

      throw new UnrecoverableError(err.message);
      //    ^^^^^^^^^^^^^^^^^^^^^^ BullMQ moves this straight
      //    to the failed set with no further attempts, which
      //    is the difference between one failure and five.
    }

    throw err;      // transient: let the queue retry
  }

  await db.update(users)
    .set({ welcomeEmailStatus: "sent" })
    .where(eq(users.id, user.id));
}, { connection, concurrency: 5 });
//
// Without those branches, one deleted user produces five
// attempts across thirty seconds and one permanent failure in
// the set, and your failed set fills with jobs that were never
// going to work.


// ── ⚠ Backoff with jitter, because the queue case is worse ──
export const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "jittered", delay: 1000 },
  },
});

// The strategy has to be registered on the WORKER.
const worker = new Worker("email", handler, {
  connection,
  settings: {
    backoffStrategy(attemptsMade) {
      const exponential = Math.min(60_000, 1000 * 2 ** attemptsMade);
      return Math.round(Math.random() * exponential);   // full jitter
    },
  },
});
//
// Why this matters more here than in Day 22's HTTP retries:
//
//   Your email provider goes down. 2,000 queued jobs fail in
//   the next four seconds. With plain exponential backoff,
//   all 2,000 schedule attempt 2 for almost exactly the same
//   instant.
//
//   Day 22 measured this: 1000 clients without jitter
//   produced 1 distinct retry time. Here it is 2,000 jobs
//   arriving together at a provider that is already down,
//   which is how you extend their outage.
//
// Five lines, and BullMQ does not do it for you.


// ── ⚠ The DLQ needs three things ────────────────────────────

// 1. A metric, so you know it exists.
const failedGauge = meter.createObservableGauge("queue_failed_jobs");
failedGauge.addCallback(async (result) => {
  for (const queue of [emailQueue, pdfQueue, webhookQueue]) {
    result.observe(await queue.getFailedCount(), { queue: queue.name });
    //                                            ^^^^^^^^^^^^^^^^^^
    //                                            Day 21: bounded label
  }
});

// 2. An alert. A failed set that grows is a bug you have not
//    found yet.
//
//    alert: queue_failed_jobs > 50 for 10 minutes
//
//    Note the "for 10 minutes": a spike during a provider
//    outage is expected and will drain. Sustained growth is
//    not.

// 3. A way to replay, or the first two only tell you bad news.
export async function replayFailed(queue, { limit = 100, since } = {}) {
  const failed = await queue.getFailed(0, limit - 1);
  let retried = 0;

  for (const job of failed) {
    if (since && job.finishedOn < since.getTime()) continue;

    // ⚠ Do not replay an UnrecoverableError. It failed for a
    // reason that has not changed.
    if (job.failedReason?.includes("undeliverable")) continue;

    await job.retry();
    retried++;
  }

  log().info({ queue: queue.name, retried }, "replayed failed jobs");
  return retried;
}

// Behind an admin permission, from Day 19.
app.post("/admin/queues/:name/replay", {
  preHandler: [authenticate, app.requirePermission("queues.replay")],
  schema: { params: z.object({ name: z.enum(["email", "pdf", "webhook"]) }) },
}, async (request) => {
  const queue = QUEUES[request.params.name];
  return { retried: await replayFailed(queue) };
});
//
// This endpoint is the difference between "we fixed the bug"
// and "we fixed the bug and the 400 affected users got their
// emails". Without it, fixing the cause does nothing for the
// work already lost.


// ── ⚠ Stalled jobs, and the lock duration ───────────────────
const worker = new Worker("pdf", async (job) => {
  await generatePdf(job.data.userId);       // sometimes 45 seconds
}, {
  connection,
  lockDuration: 30_000,        // ← the default
});
//
// A job taking 45 seconds with a 30-second lock:
//
//   t=0     worker A picks it up, lock expires at t=30
//   t=30    lock expires. BullMQ considers it STALLED.
//   t=30    worker B picks up the same job.
//   t=45    A finishes and writes the PDF.
//   t=75    B finishes and writes the PDF again.
//
// Two PDFs, two uploads, two charges if it were billable, and
// nothing errored. This is Day 23's lock-TTL demonstration in
// a different costume.

// ✓ Either raise the lock beyond the worst case:
const worker = new Worker("pdf", handler, {
  connection,
  lockDuration: 120_000,
  stalledInterval: 30_000,
  maxStalledCount: 1,
});

// ✓ Or, better, extend it while working:
const worker = new Worker("pdf", async (job) => {
  const renew = setInterval(() => {
    job.extendLock(job.token, 30_000).catch((err) =>
      log().warn({ err, jobId: job.id }, "lock renewal failed"));
  }, 10_000);
  renew.unref();

  try {
    await generatePdf(job.data.userId);
  } finally {
    clearInterval(renew);
  }
}, { connection, lockDuration: 30_000 });
//
// Same shape as Day 23's lease renewal, and the same honest
// caveat: it narrows the window and cannot close it. A long
// enough pause still produces two runs, which is why the next
// lesson is about making that safe rather than rare.`,
      },
      keyTakeaways: [
        "A queue retries by default, so an error you meant as permanent becomes five attempts unless you say otherwise.",
        "Give a job two exits: throw for transient failures, and return after recording permanent ones.",
        "`UnrecoverableError` in BullMQ skips remaining attempts, which is the difference between one failure and five.",
        "Without that distinction the failed set fills with jobs nobody will ever fix.",
        "Backoff needs jitter more in a queue than in HTTP, because a provider outage makes thousands of jobs fail within seconds and schedule the same retry time.",
        "Day 22 measured 1 distinct retry time across 1000 clients without jitter. BullMQ's exponential backoff does not add jitter by default.",
        "BullMQ's dead-letter equivalent is a failed set: a list you must look at, not a queue something consumes.",
        "A dead-letter queue nobody reads is a slower way of losing the job. It needs a metric, an alert, and a replay path.",
        "Without a replay path, fixing the cause does nothing for the work already lost.",
        "Alert on sustained growth rather than a spike, since a provider outage produces an expected burst that drains.",
        "A crashed worker leaves a job active with nobody working on it, and BullMQ returns it to the queue after the lock expires.",
        "A job slower than `lockDuration` gets re-run while the first attempt is still going, which is Day 23's lock-TTL problem again.",
        "Extend the lock while working. It narrows the window and cannot close it, which is why the next lesson exists.",
      ],
      commonMistakes: [
        "Throwing for every failure, so a malformed payload produces five attempts across twenty minutes instead of one.",
        "Not using `UnrecoverableError` for a permanent failure, filling the failed set with unfixable jobs.",
        "Exponential backoff with no jitter, so a provider outage produces a synchronised retry wave at a service that is already down.",
        "Leaving the failed set unmonitored, so a growing pile of lost work is invisible.",
        "Alerting on any failure rather than sustained growth, so a provider blip pages someone at 3am for something that drains.",
        "No replay path, so fixing the bug helps future jobs and nothing already failed.",
        "Replaying jobs that failed permanently, which fails them again for the same unchanged reason.",
        "A `lockDuration` shorter than the job's worst case, so a slow job is processed twice concurrently.",
        "Raising the lock duration and never extending it, which just moves the threshold rather than tracking the work.",
      ],
      quiz: [
        {
          question: "What does a queue do by default when your job function throws?",
          options: [
            "Marks it failed permanently",
            "Retries it, so an error you meant as permanent becomes several attempts unless you say otherwise",
            "Logs and drops it",
            "Moves it to the dead-letter queue",
          ],
          correctIndex: 1,
          explanation:
            "Give a job two exits: throw for transient failures, and return after recording permanent ones. `UnrecoverableError` skips the rest.",
        },
        {
          question: "Why does jitter matter more in a queue than in an HTTP client?",
          options: [
            "Jobs are larger",
            "A provider outage makes thousands of queued jobs fail within seconds, so they all schedule the same retry time and arrive together at a service already down",
            "Queues retry faster",
            "Redis serialises retries",
          ],
          correctIndex: 1,
          explanation:
            "Day 22 measured 1 distinct retry time across 1000 clients without jitter, and BullMQ's exponential backoff does not add any.",
        },
        {
          question: "What does a dead-letter queue need beyond existing?",
          options: [
            "A longer retention period",
            "A metric, an alert on sustained growth, and a way to replay jobs after fixing the cause",
            "A separate Redis",
            "A schema",
          ],
          correctIndex: 1,
          explanation:
            "Without the replay path, fixing the bug helps future jobs and does nothing for the work already lost.",
        },
        {
          question: "What happens when a worker crashes mid-job?",
          options: [
            "The job is marked failed",
            "It is active with nobody working on it, and the queue returns it after the lock expires, so it runs twice",
            "It is lost",
            "The queue pauses",
          ],
          correctIndex: 1,
          explanation:
            "Which is why at-least-once delivery is the default and why idempotency is the next lesson.",
        },
        {
          question: "A job takes 45 seconds and `lockDuration` is 30 seconds. What happens?",
          options: [
            "The lock extends automatically",
            "The lock expires, a second worker picks up the same job, and both complete it. Nothing errors.",
            "The job fails",
            "The worker is killed",
          ],
          correctIndex: 1,
          explanation:
            "Day 23's lock-TTL problem again. Extend the lock while working, and accept that it narrows rather than closes the window.",
        },
      ],
    },
    {
      id: "job-idempotency",
      title: "Making jobs safe to run twice",
      durationMinutes: 11,
      explanation:
        "## At-least-once delivery\n\n<b>At-least-once delivery</b> (the queue guarantees a job runs, and may run it more than once).\n\n> This is not a limitation of a particular library, it is the only guarantee that is achievable. To promise exactly-once, a queue would have to know whether your job's side effect happened, and it cannot: it only knows whether your function returned. Between \"the effect happened\" and \"the queue was told\" there is always a gap, and a crash can land in it.\n>\n> So the correct mental model is: <b>every job will eventually run twice</b>. Not might. Design for it and the double run is uneventful.\n\n---\n\n## The gap, concretely\n\n```text\nworker charges the card       ✅ money moved\nworker marks the job complete ❌ process killed\n     ↓\nlock expires, job returns to the queue\n     ↓\nanother worker charges the card again\n```\n\n> Notice that nothing was wrong with the code. The charge succeeded, the queue did what it promised, and the customer paid twice. The previous lesson's stalled-job recovery is what makes this a routine event rather than a rare one.\n\n---\n\n## Making a job idempotent\n\nDay 22's tools apply unchanged, and the priority order is worth restating.\n\n> <b>A unique constraint</b> is the strongest, because it makes the duplicate impossible rather than unlikely and it does not depend on your job's control flow being correct. `UNIQUE (user_id, kind)` on a notifications table means a second attempt fails at the database and you catch and return.\n>\n> <b>An idempotency key passed to the third party</b> is next, because your database cannot protect their side. Day 22's payment provider example applies exactly: derive a stable key from the job's data, not from the attempt.\n>\n> <b>A status column on the record</b> is the weakest and the most common. It works, and it has the same check-then-act gap Day 22 demonstrated, so it needs the update to be conditional rather than a read followed by a write.\n\n---\n\n## The key must come from the data\n\n> The mistake that undoes all of this: deriving the idempotency key from the job id or the attempt. A retried job may have a new id, and a stalled job that gets re-queued certainly has a new attempt, so the key differs and the deduplication does nothing.\n>\n> Derive it from what the job is <b>about</b>. `welcome-email:user:8811` is stable across every retry, every stall and every replay from the dead-letter queue, which is exactly the property you need.\n\n---\n\n## Order the steps for the failure you prefer\n\n> You cannot make the effect and the record atomic when the effect is external, so choose which way you fail. Do the external work <b>first</b> and record it second: a crash then leaves a charge with no record, which is reconcilable from the provider. The other order leaves a record with no charge, which means you believe you took money you did not.\n>\n> Day 22 made the same argument for a request path. The queue version is more important, because the double run is guaranteed rather than possible.",
      diagram: `At-least-once is the ONLY achievable guarantee

    not a limitation of one library.

    to promise exactly-once, a queue would have to
    know whether YOUR SIDE EFFECT happened.

    it cannot. it only knows whether your FUNCTION
    RETURNED.

    between "the effect happened" and "the queue
    was told" there is ALWAYS A GAP, and a crash
    can land in it.

    → the correct model:

      EVERY JOB WILL EVENTUALLY RUN TWICE.

      not might. design for it, and the double run
      is uneventful.


The gap, concretely

    worker charges the card        ✅ money moved
    worker marks the job complete  ❌ killed
         ↓
    lock expires, job re-queued
         ↓
    another worker charges again

    ⚠ nothing was wrong with the code.

      the charge succeeded
      the queue did what it promised
      the customer paid twice

    and the last lesson's stalled-job recovery is
    what makes this ROUTINE rather than rare.


Making a job idempotent, in priority order

    1. A UNIQUE CONSTRAINT          strongest

       makes the duplicate IMPOSSIBLE, not
       unlikely, and does not depend on your
       control flow being right

       UNIQUE (user_id, kind) on notifications
       → the second attempt fails at the database
         and you catch and return

    2. AN IDEMPOTENCY KEY TO THE THIRD PARTY

       your database cannot protect THEIR side

       Day 22's payment example, exactly

    3. A STATUS COLUMN               weakest, and
                                     most common

       it works, and it has Day 22's demonstrated
       check-then-act gap

       → the update must be CONDITIONAL, not a
         read followed by a write


⚠⚠ The key must come from THE DATA

    the mistake that undoes all of this:

      deriving the key from the JOB ID or the
      ATTEMPT

      a retried job may have a new id
      a re-queued stalled job certainly has a new
        attempt

      → the key differs, and the deduplication
        does NOTHING

    derive it from what the job is ABOUT:

      welcome-email:user:8811

    stable across every retry, every stall and
    every DLQ replay. that is the property you
    need.


Order the steps for the failure you PREFER

    you cannot make an EXTERNAL effect and a local
    record atomic. so choose how you fail.

    EXTERNAL WORK FIRST, record second
      → a crash leaves a CHARGE WITH NO RECORD
      → reconcilable from the provider

    the other order
      → a RECORD WITH NO CHARGE
      → you believe you took money you did not

    Day 22 made this argument for a request path.
    the queue version matters MORE, because the
    double run is GUARANTEED rather than possible.`,
      codeExample: {
        title: "Three levels of protection, strongest first",
        code: `// ── 1. ✓ A unique constraint. The strongest. ────────────────
// migrations
CREATE TABLE sent_notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  kind        TEXT NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sent_notifications_once UNIQUE (user_id, kind)
);

const worker = new Worker("email", async (job) => {
  const { userId } = job.data;

  // Claim the right to send, before sending. A second run
  // fails here and never reaches the provider.
  try {
    await db.insert(sentNotifications).values({ userId, kind: "welcome" });
  } catch (err) {
    if (err.code === "23505") {          // unique violation
      log().info({ userId, jobId: job.id }, "welcome already sent, skipping");
      return { skipped: "already_sent" };
    }
    throw err;
  }

  await sendWelcomeEmail(await loadUser(db, userId));
}, { connection });
//
// ⚠ Note the order and its trade. Claiming first means a
// crash between the insert and the send loses the email
// entirely: the row says sent and no email went out.
//
// For an email that is usually the right trade, because a
// duplicate welcome email annoys somebody and a missing one
// is recoverable by the sweep from two lessons ago.
//
// For a CHARGE it is the wrong way round, which is the last
// section of this lesson.


// ── 2. ✓ An idempotency key to the third party ──────────────
// Your database cannot stop their side charging twice, so pass
// them a key. Day 22, unchanged.
const worker = new Worker("payments", async (job) => {
  const { orderId, amountCents } = job.data;

  const charge = await stripe.charges.create(
    { amount: amountCents, currency: "usd" },
    { idempotencyKey: \`order-charge:\${orderId}\` },
    //                 ^^^^^^^^^^^^^^^^^^^^^^^^ derived from
    //                 the DATA, not the job id or the attempt
  );

  // Record it. A duplicate here is impossible because of the
  // constraint below, and their side deduplicated anyway.
  await db.insert(payments)
    .values({ orderId, chargeId: charge.id, amountCents })
    .onConflictDoNothing({ target: payments.orderId });

  return { chargeId: charge.id };
}, { connection });

// ALTER TABLE payments ADD CONSTRAINT payments_order_unique
//   UNIQUE (order_id);
//
// Two independent protections: theirs, keyed by the order, and
// yours, constrained by the order. Either one alone would do,
// and having both means neither has to be perfect.


// ── ⚠⚠ The key that does not work ───────────────────────────
// ✗ From the job id:
{ idempotencyKey: \`charge:\${job.id}\` }
//
// A stalled job returned to the queue can be re-queued with a
// new id, and a replay from the failed set definitely creates
// one. Different key, no deduplication, second charge.

// ✗ From the attempt:
{ idempotencyKey: \`charge:\${orderId}:\${job.attemptsMade}\` }
//
// This is worse, because it looks deliberate. Attempt 1 and
// attempt 2 have different keys by construction, so retries
// are exactly what it fails to protect against.

// ✓ From the data:
{ idempotencyKey: \`order-charge:\${orderId}\` }
//
// The test: would this key be identical if the job ran again
// for any reason at all? If not, it is not an idempotency key.


// ── 3. ⚠ A status column, and its gap ───────────────────────
// ✗ Read then write. Day 22's demonstrated window.
const worker = new Worker("reports", async (job) => {
  const [row] = await db.select().from(reports)
    .where(eq(reports.id, job.data.reportId));

  if (row.status === "generated") return { skipped: true };   // check

  await generateReport(row);                                  // act
  await db.update(reports).set({ status: "generated" })
    .where(eq(reports.id, row.id));
});
//
// Two workers on the same stalled job both read "pending",
// both generate, and both write "generated". The check found
// nothing wrong because at the moment each checked, nothing
// was.

// ✓ A conditional update. The database decides, atomically.
const worker = new Worker("reports", async (job) => {
  const claimed = await db.update(reports)
    .set({ status: "generating", startedAt: new Date() })
    .where(and(
      eq(reports.id, job.data.reportId),
      eq(reports.status, "pending"),
      //  ^^^^^^^^^^^^^^^^^^^^^^^^^^ the whole fix. Only one
      //  update can match a row that is still pending.
    ))
    .returning({ id: reports.id });

  if (claimed.length === 0) {
    log().info({ reportId: job.data.reportId }, "already claimed, skipping");
    return { skipped: "already_claimed" };
  }

  try {
    const key = await generateReport(claimed[0].id);
    await db.update(reports).set({ status: "generated", key })
      .where(eq(reports.id, claimed[0].id));
  } catch (err) {
    // Release the claim, or a transient failure blocks every
    // retry forever. Day 22's idempotency-key release, again.
    await db.update(reports).set({ status: "pending" })
      .where(eq(reports.id, claimed[0].id));
    throw err;
  }
}, { connection });
//
// This is the same shape as Day 22's "insert the key first and
// let the constraint be the lock": make the database arbitrate
// rather than your code.


// ── ⚠ Order the steps for the failure you prefer ────────────
// ✗ Record first, then charge:
await db.insert(payments).values({ orderId, amountCents });
// ← crash here
await stripe.charges.create({ ... });
//
// Your database says the order is paid. No money moved. You
// ship goods for free and your reconciliation says everything
// is fine, because your side is internally consistent and
// wrong.

// ✓ Charge first, then record:
const charge = await stripe.charges.create({ ... },
  { idempotencyKey: \`order-charge:\${orderId}\` });
// ← crash here
await db.insert(payments).values({ orderId, chargeId: charge.id, amountCents });
//
// A charge with no record. The customer paid and your system
// does not know, which is bad and RECONCILABLE: the provider
// has the record, the idempotency key ties it to the order,
// and the retry finds the existing charge rather than making
// a new one.
//
// Both orders lose something on a crash. Pick the one where
// what you lose can be recovered from somebody else's
// records.


// ── The test worth writing for every job ────────────────────
test("running the welcome job twice sends one email", async () => {
  const sent = [];
  const handler = makeWelcomeHandler({ send: (u) => sent.push(u.id) });

  const job = { id: "1", data: { userId: user.id }, attemptsMade: 0 };

  await handler(job);
  await handler({ ...job, id: "2", attemptsMade: 1 });
  //              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ a different id
  //              and attempt, exactly like a re-queued stalled
  //              job

  assert.equal(sent.length, 1);
});
// Five lines, and it is the only test that checks the property
// the whole day depends on. Note it deliberately varies the
// job id, which is what catches an idempotency key derived
// from the wrong thing.`,
      },
      keyTakeaways: [
        "At-least-once is the only achievable guarantee, because a queue only knows whether your function returned, not whether your side effect happened.",
        "So the model is that every job will eventually run twice. Design for it and the double run is uneventful.",
        "The gap is real and routine: the charge succeeds, the process dies before the job is marked complete, the lock expires, and another worker charges again.",
        "Nothing was wrong with the code in that sequence, which is why stalled-job recovery makes this common rather than rare.",
        "A unique constraint is the strongest protection, because it makes the duplicate impossible and does not depend on your control flow.",
        "An idempotency key passed to the third party is next, because your database cannot protect their side.",
        "A status column is weakest and most common, and it needs a conditional update rather than a read followed by a write.",
        "Derive the idempotency key from the job's data, never from the job id or the attempt number.",
        "A key including the attempt fails at exactly the thing it looks designed for, because attempt 1 and 2 differ by construction.",
        "The test for a key: would it be identical if the job ran again for any reason? If not, it is not an idempotency key.",
        "Do the external work first and record it second, so a crash leaves a charge you can reconcile rather than a record of money you never took.",
        "Release a claim on failure, or a transient error blocks every retry forever.",
        "Write the test that runs the handler twice with a different job id. It is the only test that checks the property the whole day depends on.",
      ],
      commonMistakes: [
        "Assuming exactly-once delivery, which no queue provides and none can.",
        "Deriving an idempotency key from the job id, which changes on a replay or re-queue.",
        "Including the attempt number in the key, which guarantees retries are not deduplicated.",
        "Checking a status column and then acting, which two workers on a stalled job both pass.",
        "Not releasing a claimed status on failure, so a transient error permanently blocks the job.",
        "Recording the payment before charging, so a crash leaves your system believing it took money it did not.",
        "Relying only on your own database when the side effect is external, which cannot stop the provider charging twice.",
        "Never testing the double run, so the property the whole design depends on is unverified.",
      ],
      quiz: [
        {
          question: "Why can a queue not offer exactly-once delivery?",
          options: [
            "Implementation limits",
            "It only knows whether your function returned, not whether your side effect happened, and a crash can land in the gap between them",
            "Redis is not durable",
            "Network partitions",
          ],
          correctIndex: 1,
          explanation:
            "So the model is that every job will eventually run twice, and the design question is whether that is uneventful.",
        },
        {
          question: "What is wrong with an idempotency key that includes the attempt number?",
          options: [
            "It is too long",
            "Attempt 1 and attempt 2 have different keys by construction, so retries are exactly what it fails to deduplicate",
            "Providers reject it",
            "Nothing",
          ],
          correctIndex: 1,
          explanation:
            "The test is whether the key would be identical if the job ran again for any reason. Derive it from the data.",
        },
        {
          question: "Why is a status column check-then-act unsafe?",
          options: [
            "It is slow",
            "Two workers on a stalled job both read \"pending\", both do the work, and both write the completed status",
            "Columns cannot be indexed",
            "It needs a transaction",
          ],
          correctIndex: 1,
          explanation:
            "Use a conditional update with `WHERE status = 'pending'`, so only one update can match and the database arbitrates.",
        },
        {
          question: "Should you record the payment before or after charging the card?",
          options: [
            "Before, so your data is consistent",
            "After. A crash then leaves a charge with no record, which is reconcilable from the provider, rather than a record of money you never took.",
            "It does not matter",
            "In the same transaction",
          ],
          correctIndex: 1,
          explanation:
            "Both orders lose something on a crash. Pick the one where what you lose can be recovered from somebody else's records.",
        },
        {
          question: "What is the one test that checks the property this whole day depends on?",
          options: [
            "That the job completes",
            "Running the handler twice with a different job id and asserting the side effect happened once",
            "That retries work",
            "That the queue drains",
          ],
          correctIndex: 1,
          explanation:
            "Varying the job id is what catches a key derived from the wrong thing, which is the most common way this design fails.",
        },
      ],
    },
    {
      id: "concurrency-and-capacity",
      title: "Concurrency, rate limits and queue depth",
      durationMinutes: 11,
      explanation:
        "## Concurrency\n\n<b>Concurrency</b> (how many jobs one worker processes at the same time).\n\n```text\nconcurrency 1    1 → 2 → 3 → 4\nconcurrency 10   ten in flight at once\n```\n\n> Higher is not better, and the reason is that <b>concurrency does not create capacity, it reveals where the bottleneck is</b>. Ten concurrent jobs each holding a database connection is ten connections, and Day 17's arithmetic applies: four workers at concurrency ten is forty connections from your pool budget before your API gets any.\n>\n> And for CPU-bound work concurrency does almost nothing, because Day 3's lesson stands: ten concurrent PDF generations on one event loop are ten jobs taking turns, and each one now takes ten times as long while none finishes sooner.\n\n---\n\n## The two kinds of job\n\n```text\nI/O-bound   waiting on a network or a database  → concurrency helps\nCPU-bound   compressing, rendering, hashing     → concurrency does not\n```\n\n> For CPU-bound jobs the answer is <b>more worker processes</b>, not more concurrency, or a worker thread from Day 11. Getting this backwards is why a queue sometimes gets slower when you tune it: you raised concurrency on image resizing, and now every job is slow instead of some jobs waiting.\n\n---\n\n## Rate limiting\n\n> A worker will happily go faster than the thing it is calling. If an API allows 100 requests a minute and your queue has 10,000 jobs, your worker will find out about the limit by being rate limited, and Day 22's retry logic will then turn that into a retry storm against a provider that is correctly refusing you.\n>\n> BullMQ's limiter caps the queue's throughput, which is the right place for it: the constraint belongs to the dependency, so it should be expressed once on the queue rather than in each job.\n\n---\n\n## Queue depth\n\n<b>Queue depth</b> (how many jobs are waiting).\n\n```text\n10 → 100 → 500 → 2,000 → 10,000\n```\n\n> Depth alone is not the signal, because a healthy queue is often deep during a burst and drains fine. The signal is the <b>derivative</b>: is depth growing over minutes? A queue whose depth rises steadily has a producer faster than its consumers, and that never fixes itself.\n>\n> The more useful number is <b>oldest waiting job age</b>. Depth of 10,000 that drains in a minute is fine; depth of 50 where the oldest has waited an hour means something is stuck, and depth cannot tell you which situation you are in.\n\n---\n\n## What to monitor\n\n```text\nwaiting        depth\nactive         in flight\nfailed         the DLQ, from the last lesson\ndelayed        scheduled for later\noldest waiting the number that matters\nduration       p95 per job type\n```\n\n> And one that is easy to forget: <b>is a worker connected at all?</b> A queue with depth 5,000 and no consumer looks identical in Redis to a queue that is merely busy. Emit a heartbeat metric from each worker, so \"nobody is processing this\" is a distinct alert from \"this is slow\".",
      diagram: `Concurrency does not CREATE capacity

    it REVEALS WHERE THE BOTTLENECK IS.

    concurrency 1    1 → 2 → 3 → 4
    concurrency 10   ten in flight

    ⚠ ten concurrent jobs each holding a database
      connection is TEN CONNECTIONS.

      Day 17's arithmetic:
        4 workers × concurrency 10 = 40
        connections from your pool budget, before
        your API gets any


⚠⚠ And for CPU-bound work it does almost nothing

    Day 3 stands: ten concurrent PDF generations
    on one event loop are ten jobs TAKING TURNS.

    each one now takes TEN TIMES AS LONG and none
    finishes sooner.

    I/O-BOUND   waiting on network or a database
                → concurrency HELPS
    CPU-BOUND   compressing, rendering, hashing
                → concurrency does NOT

    for CPU-bound: MORE WORKER PROCESSES, or a
    worker thread (Day 11).

    getting this backwards is why a queue
    sometimes gets SLOWER when you tune it: you
    raised concurrency on image resizing, and now
    every job is slow instead of some jobs waiting.


Rate limiting

    a worker will happily go faster than the thing
    it is calling.

    100 requests/minute allowed
    10,000 jobs queued

    → your worker finds out about the limit BY
      BEING RATE LIMITED

    → and Day 22's retry logic turns that into a
      RETRY STORM against a provider correctly
      refusing you

    BullMQ's limiter caps the QUEUE'S throughput,
    which is the right place: the constraint
    belongs to the DEPENDENCY, so express it once
    on the queue rather than in each job.


⚠ Queue depth is not the signal

    10 → 100 → 500 → 2,000 → 10,000

    a HEALTHY queue is often deep during a burst
    and drains fine.

    the signal is the DERIVATIVE:

      is depth growing over MINUTES?

      a queue whose depth rises steadily has a
      producer faster than its consumers, and that
      NEVER FIXES ITSELF.

    ⚠ the more useful number is OLDEST WAITING JOB
      AGE.

      depth 10,000 draining in a minute   fine
      depth 50, oldest waited an hour     STUCK

      depth cannot tell you which you are in.


What to monitor

    waiting          depth
    active           in flight
    failed           the DLQ (last lesson)
    delayed          scheduled for later
    OLDEST WAITING   the number that matters
    duration         p95 per job type

⚠ and the one easy to forget:

    IS A WORKER CONNECTED AT ALL?

    a queue with depth 5,000 and NO CONSUMER looks
    identical in Redis to one that is merely busy.

    emit a heartbeat metric from each worker, so
    "nobody is processing this" is a DISTINCT
    ALERT from "this is slow".`,
      codeExample: {
        title: "Concurrency by job type, and the metrics that matter",
        code: `// ── Concurrency chosen by what the job waits on ─────────────

// I/O-bound: mostly waiting on a provider. Concurrency helps.
const emailWorker = new Worker("email", sendEmailHandler, {
  connection,
  concurrency: 20,
});

// ⚠ CPU-bound: concurrency does almost nothing.
const pdfWorker = new Worker("pdf", generatePdfHandler, {
  connection,
  concurrency: 2,
  //           ^ not 20. Day 3: PDF rendering runs on the event
  //           loop, so 20 concurrent renders are 20 jobs
  //           taking turns. Each takes 20× longer, none
  //           finishes sooner, and your p95 per job goes from
  //           3s to 60s while throughput is unchanged.
});
// For CPU-bound throughput, scale PROCESSES:
//   docker compose up --scale pdf-worker=4
// or move the work to a worker thread from Day 11.


// ── ⚠ The connection arithmetic, from Day 17 ────────────────
// Each in-flight job that queries the database holds a pool
// connection for its duration.
//
//   emailWorker  concurrency 20, 2 replicas  = up to 40
//   pdfWorker    concurrency  2, 4 replicas  = up to  8
//   API          pool 10,        4 replicas  = up to 40
//   migrations + cron + a human psql         =      ~10
//   ──────────────────────────────────────────────────────
//   total                                          ~98
//
// Against a Postgres max_connections of 100. Day 17's
// warning, and the worker pools are the ones nobody counts,
// because they are in a different deployment.
//
// So workers get their own explicit, smaller pools:
const workerDb = drizzle(new pg.Pool({
  connectionString: config.database.url,
  max: 4,                     // NOT the API's 10
  connectionTimeoutMillis: 5000,
}));
// A worker at concurrency 20 with a pool of 4 means 16 jobs
// wait for a connection, which is fine: they are jobs, and
// waiting is what a queue is for. Better that than exhausting
// the database and taking the API down with it.


// ── Rate limiting, expressed on the queue ───────────────────
const providerQueue = new Queue("provider-sync", { connection });

const providerWorker = new Worker("provider-sync", syncHandler, {
  connection,
  concurrency: 5,
  limiter: {
    max: 90,                  // their limit is 100/min. Leave
    duration: 60_000,         // headroom for retries.
  },
});
//
// The limiter is on the WORKER and it caps the whole queue's
// throughput across every instance of that worker, which is
// what you want: the constraint belongs to the provider, not
// to one of your processes.
//
// ✗ Without it:
//   10,000 jobs, concurrency 5, each taking 200ms
//     = 25 requests/second = 1,500/minute
//
//   against a 100/minute limit. So 1,400 of those get a 429,
//   Day 22's retry logic schedules them all, and now you are
//   sending a retry storm at a provider who is correctly
//   refusing you. Their rate limiter becomes your outage.


// ── The metrics that matter ─────────────────────────────────
const queueDepth = meter.createObservableGauge("queue_waiting_jobs");
const queueActive = meter.createObservableGauge("queue_active_jobs");
const queueFailed = meter.createObservableGauge("queue_failed_jobs");
const oldestWaiting = meter.createObservableGauge("queue_oldest_waiting_seconds");

for (const gauge of [queueDepth, queueActive, queueFailed, oldestWaiting]) {
  gauge.addCallback(async (result) => {
    for (const queue of Object.values(QUEUES)) {
      const counts = await queue.getJobCounts("waiting", "active", "failed", "delayed");
      const label = { queue: queue.name };
      //             ^^^^^^^^^^^^^^^^^^^ Day 21: a bounded label.
      //             Never the job id.

      if (gauge === queueDepth) result.observe(counts.waiting, label);
      if (gauge === queueActive) result.observe(counts.active, label);
      if (gauge === queueFailed) result.observe(counts.failed, label);

      if (gauge === oldestWaiting) {
        const [oldest] = await queue.getWaiting(0, 0);
        result.observe(
          oldest ? (Date.now() - oldest.timestamp) / 1000 : 0,
          label,
        );
      }
    }
  });
}


// ── ⚠ Why depth alone is the wrong alert ────────────────────
// ✗ alert: queue_waiting_jobs > 1000
//
//   Fires every morning when the nightly batch enqueues
//   50,000 jobs that drain in four minutes. People mute it,
//   and then it does not fire when it matters.
//
// ✓ Two alerts, for two different problems:
//
//   alert: queue_oldest_waiting_seconds > 300
//     Something has been waiting five minutes. That is
//     actionable regardless of depth: it fires on a stuck
//     queue of 50 jobs and stays quiet on a healthy queue of
//     50,000.
//
//   alert: deriv(queue_waiting_jobs[10m]) > 0 for 30m
//     Depth is rising steadily. The producer is faster than
//     the consumers, and that never fixes itself.


// ── ⚠ And the alert people forget ───────────────────────────
// A queue with 5,000 waiting jobs and NO WORKER CONNECTED
// looks identical in Redis to a busy one.
//
// So emit a heartbeat from each worker:
const workerHeartbeat = meter.createObservableGauge("worker_last_seen_seconds");

setInterval(async () => {
  await redis.set(\`worker:heartbeat:\${worker.name}:\${process.pid}\`,
    Date.now(), { EX: 60 });
}, 15_000).unref();

// And alert on its absence:
//   alert: absent(worker_last_seen_seconds{queue="email"}) for 2m
//
// "Nobody is processing this queue" and "this queue is slow"
// need to be different alerts, because they need different
// responses: one is a deploy that failed and one is capacity.
//
// This is the failure mode from the first lesson of the day:
// a queue nothing consumes looks exactly like a queue that is
// working, until somebody checks.


// ── Duration, per job type ──────────────────────────────────
worker.on("completed", (job, result) => {
  jobDuration.record(Date.now() - job.processedOn, {
    queue: worker.name,
    jobName: job.name,        // bounded: a handful of names
  });
});
//
// Day 21's percentile lesson: record a histogram, alert on
// p95, and keep the max. A mean job duration hides the one
// job type that takes forty seconds, and that job type is
// usually the reason your queue is deep.`,
      },
      keyTakeaways: [
        "Concurrency does not create capacity, it reveals where the bottleneck is.",
        "Ten concurrent jobs holding database connections is ten connections, and Day 17's pool arithmetic must include every worker replica.",
        "Worker pools are the connections nobody counts, because they live in a different deployment.",
        "For CPU-bound jobs concurrency does almost nothing: ten renders on one event loop take turns, each ten times slower with no extra throughput.",
        "Scale CPU-bound work with more processes or a worker thread, not more concurrency.",
        "Getting that backwards is why tuning a queue sometimes makes it slower.",
        "A worker will outpace the API it calls, so express the rate limit once on the queue rather than in each job.",
        "Without a limiter, a provider's rate limiting plus Day 22's retries becomes a retry storm you aimed at yourself.",
        "Queue depth alone is the wrong alert, because a healthy queue is often deep during a burst.",
        "Alert on the oldest waiting job's age, which fires on a stuck queue of 50 and stays quiet on a healthy queue of 50,000.",
        "Also alert on depth growing steadily over minutes, because a producer faster than its consumers never fixes itself.",
        "A queue with no worker connected looks identical to a busy one, so emit a heartbeat and alert on its absence.",
        "\"Nobody is processing this\" and \"this is slow\" need different alerts because they need different responses.",
        "Record job duration as a histogram per job name, because a mean hides the one job type that takes forty seconds.",
      ],
      commonMistakes: [
        "Raising concurrency on a CPU-bound job, which makes every job slower without improving throughput.",
        "Not counting worker concurrency times replicas against the database's connection budget.",
        "Giving workers the same pool size as the API, when a queue can afford to wait for a connection and the API cannot.",
        "No rate limiter on a queue that calls a rate-limited API, so their limiter plus your retries becomes an outage.",
        "Putting the rate limit in the job handler rather than on the queue, so it does not hold across replicas.",
        "Alerting on raw queue depth, which fires on every nightly batch and gets muted.",
        "Not tracking the oldest waiting job, which is the number that distinguishes stuck from busy.",
        "No worker heartbeat, so a queue with no consumer is indistinguishable from a busy one.",
        "Recording a mean job duration, which hides the slow job type that is causing the depth.",
      ],
      quiz: [
        {
          question: "What does raising concurrency actually do?",
          options: [
            "Creates capacity",
            "Reveals where the bottleneck is. For I/O-bound jobs it helps; for CPU-bound jobs the work just takes turns on one event loop.",
            "Reduces memory",
            "Speeds up Redis",
          ],
          correctIndex: 1,
          explanation:
            "Ten concurrent renders each take ten times as long and none finishes sooner. Scale CPU-bound work with processes.",
        },
        {
          question: "Why must worker concurrency be counted against the database connection budget?",
          options: [
            "Workers use more memory",
            "Each in-flight job holds a pool connection, so concurrency times replicas is connections your API never sees coming",
            "Workers connect twice",
            "Redis shares the pool",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's arithmetic, and worker pools are the ones nobody counts because they live in a different deployment.",
        },
        {
          question: "Why put a rate limit on the queue rather than in the job?",
          options: [
            "It is simpler",
            "The constraint belongs to the dependency, so it must hold across every worker replica rather than per process",
            "Jobs cannot measure time",
            "BullMQ requires it",
          ],
          correctIndex: 1,
          explanation:
            "Without it, a provider's 429s plus Day 22's retry logic becomes a retry storm you aimed at a service correctly refusing you.",
        },
        {
          question: "Why is queue depth the wrong thing to alert on?",
          options: [
            "It is hard to measure",
            "A healthy queue is often deep during a burst, so the alert fires on every nightly batch and gets muted before it matters",
            "Depth is always zero",
            "It lags by minutes",
          ],
          correctIndex: 1,
          explanation:
            "Alert on the oldest waiting job's age, which fires on a stuck queue of 50 and stays quiet on a healthy queue of 50,000.",
        },
        {
          question: "Why do you need a worker heartbeat metric?",
          options: [
            "For load balancing",
            "A queue with 5,000 waiting jobs and no worker connected looks identical in Redis to a busy one",
            "To restart stuck workers",
            "To measure latency",
          ],
          correctIndex: 1,
          explanation:
            "\"Nobody is processing this\" and \"this is slow\" need different alerts, because one is a failed deploy and one is capacity.",
        },
      ],
    },
    {
      id: "scheduling",
      title: "Scheduling, delays and repeatable jobs",
      durationMinutes: 11,
      explanation:
        "## Delayed job\n\n<b>Delayed job</b> (a job that should not run until later).\n\n```text\nUser signs up → schedule a reminder for 24 hours later\nOrder created → schedule a review request for 7 days later\n```\n\n> The reason to use the queue's delay rather than `setTimeout` is durability. A `setTimeout` for 24 hours lives in one process's memory and dies with the next deploy, which for a Node service is measured in hours. A delayed job survives restarts because it is a row or a Redis entry, not a timer.\n>\n> And remember to <b>cancel</b>. A reminder scheduled for a user who verifies in five minutes should not arrive tomorrow, so a delayed job usually needs a deterministic id you can remove.\n\n---\n\n## Repeatable job\n\n<b>Repeatable job</b> (one that runs on a recurring schedule).\n\n```text\n0 2 * * *   → generate the daily report at 02:00\n```\n\n---\n\n## Why cron inside your API is dangerous\n\n```text\nAPI instance A → cron fires\nAPI instance B → cron fires\nAPI instance C → cron fires\n```\n\n> Three instances means the daily report runs three times, and at twenty instances it runs twenty times. The draft is right about that, and the failure is worse than duplication: your job probably was not written to tolerate concurrent copies, so three simultaneous report generations can produce three partial reports or three sets of emails.\n>\n> Note what this really is. It is Day 21's in-memory session bug and Day 19's in-process rate limiter, for the third time: <b>anything scheduled in a process is per process</b>, and it works perfectly until you scale.\n\n---\n\n## The fix, and what it costs\n\n```text\nScheduler → queue → workers\n```\n\n> A repeatable job in BullMQ is stored in Redis, so one entry produces one execution however many workers are connected. That separates <b>deciding when</b> from <b>doing the work</b>, which is the actual structural fix.\n>\n> The cost people miss: the schedule now lives in Redis and not in your code, so it can drift from your repository. A repeatable job added by a deploy last year is still there after you delete the code, and it will keep firing and failing. Register schedules idempotently at startup and remove ones you no longer declare.\n\n---\n\n## Timezones and missed runs\n\n> Two details that cause real incidents.\n>\n> A cron expression with no timezone runs in the <b>process's</b> timezone, so a container in UTC and a laptop in Kathmandu disagree about when \"02:00\" is. Set the timezone explicitly on the schedule, and prefer UTC for anything not user-facing.\n>\n> And decide what happens when a run is <b>missed</b>, because it will be: no worker was connected, or the whole system was down at 02:00. Some schedulers fire immediately on recovery, some skip. Neither is right for every job, and \"send the daily digest\" firing four hours late is a different decision from \"charge monthly subscriptions\" firing four hours late.",
      diagram: `Delayed job: use the QUEUE, not setTimeout

    signup → reminder in 24 hours
    order  → review request in 7 days

    a setTimeout for 24 hours lives in ONE
    PROCESS'S MEMORY and dies with the next
    deploy, which for a Node service is measured
    in HOURS.

    a delayed job survives restarts because it is
    a ROW or a REDIS ENTRY, not a timer.

    ⚠ and remember to CANCEL.

      a reminder for a user who verifies in five
      minutes should not arrive tomorrow

      → a delayed job usually needs a
        deterministic id you can remove


⚠⚠ Why cron inside your API is dangerous

    instance A → cron fires
    instance B → cron fires
    instance C → cron fires

    three instances = the daily report runs THREE
    TIMES. twenty instances, twenty times.

    and the failure is worse than duplication:

      your job probably was not written to
      tolerate CONCURRENT copies

      → three simultaneous report generations can
        produce three partial reports, or three
        sets of emails

    note what this really is:

      Day 21's in-memory sessions
      Day 19's in-process rate limiter
      and now this

      ANYTHING SCHEDULED IN A PROCESS IS PER
      PROCESS, and it works perfectly until you
      scale.


The fix

    SCHEDULER → QUEUE → WORKERS

    a repeatable job in BullMQ is stored in REDIS,
    so one entry produces ONE execution however
    many workers are connected.

    that separates DECIDING WHEN from DOING THE
    WORK, which is the structural fix.


⚠ The cost people miss

    the schedule now lives IN REDIS, not in your
    code, so it can DRIFT FROM YOUR REPOSITORY.

    a repeatable job added by a deploy last year
    is still there after you delete the code, and
    it will keep FIRING AND FAILING.

    → register schedules IDEMPOTENTLY at startup,
      and REMOVE ones you no longer declare.


⚠ Two details that cause real incidents

    TIMEZONE

      a cron expression with no timezone runs in
      the PROCESS'S timezone

      a container in UTC and a laptop in Kathmandu
      disagree about when "02:00" is

      → set it explicitly. prefer UTC for anything
        not user-facing.

    MISSED RUNS

      it will happen: no worker connected, or the
      system was down at 02:00

      some schedulers fire IMMEDIATELY on
      recovery, some SKIP.

      neither is right for every job:

        "send the daily digest" four hours late
        "charge monthly subscriptions" four hours
          late

      are different decisions.`,
      codeExample: {
        title: "Delays you can cancel, and schedules that do not drift",
        code: `// ── Delayed jobs, and cancelling them ───────────────────────
export async function scheduleVerificationReminder(userId) {
  await emailQueue.add(
    "verification-reminder",
    { userId },
    {
      delay: 24 * 60 * 60 * 1000,
      jobId: \`verify-reminder:\${userId}\`,
      //     ^^^^^^^^^^^^^^^^^^^^^^^^^^ deterministic, so it
      //     can be found and removed, and so a duplicate
      //     enqueue cannot create a second reminder
    },
  );
}

// ⚠ And the cancel, which is the half people forget.
export async function cancelVerificationReminder(userId) {
  const job = await emailQueue.getJob(\`verify-reminder:\${userId}\`);
  await job?.remove();
}

app.post("/verify-email", async (request, reply) => {
  await markEmailVerified(db, request.body.token);
  await cancelVerificationReminder(request.user.id);
  //    ^^^^^^^^^^^^^^^^^^^^^^^^^^ without this, a user who
  //    verifies in five minutes gets "please verify your
  //    email" tomorrow, which reads as a broken product
  return reply.send({ ok: true });
});

// ✗ And why not setTimeout:
setTimeout(() => sendReminder(userId), 24 * 60 * 60 * 1000);
//
// Lives in one process's memory. Your next deploy is probably
// in the next few hours, and every pending reminder dies with
// it. Nothing errors, nothing is logged, and the reminders
// simply never arrive.
//
// It is also per instance, so if you did somehow keep the
// process alive for 24 hours, only the instance that handled
// the signup would fire.


// ── ⚠⚠ Cron inside the API ──────────────────────────────────
// ✗ server.js
import cron from "node-cron";

cron.schedule("0 2 * * *", async () => {
  await generateDailyReport(db);
});
//
// Works perfectly with one instance. With four:
//
//   02:00  instance A → generateDailyReport()
//   02:00  instance B → generateDailyReport()
//   02:00  instance C → generateDailyReport()
//   02:00  instance D → generateDailyReport()
//
// Four reports. And because they run concurrently, if the
// function writes rows or sends emails you may get four
// partial reports interleaved rather than four identical ones,
// which is harder to diagnose than a simple duplicate.
//
// Same shape as Day 21's in-memory sessions and Day 19's
// in-process rate limiter: it is per process, and it works
// until you scale.


// ── ✓ Repeatable jobs, stored centrally ─────────────────────
// src/queues/schedules.js — the single declaration
export const SCHEDULES = [
  {
    queue: "reports",
    name: "daily-report",
    pattern: "0 2 * * *",
    tz: "UTC",
    data: {},
  },
  {
    queue: "maintenance",
    name: "sweep-pending-welcomes",
    pattern: "*/5 * * * *",
    tz: "UTC",
    data: {},
  },
  {
    queue: "maintenance",
    name: "prune-expired-sessions",
    pattern: "0 * * * *",
    tz: "UTC",
    data: {},
  },
];

// ⚠ Register idempotently AND remove what is no longer
// declared, or the schedule in Redis drifts from the code.
export async function syncSchedules() {
  const declared = new Set(SCHEDULES.map((s) => \`\${s.queue}:\${s.name}\`));

  for (const queue of Object.values(QUEUES)) {
    const existing = await queue.getJobSchedulers();

    for (const scheduler of existing) {
      if (!declared.has(\`\${queue.name}:\${scheduler.name}\`)) {
        await queue.removeJobScheduler(scheduler.key);
        log().warn({ queue: queue.name, name: scheduler.name },
          "removed schedule no longer declared in code");
        // This log line is the point. Without the removal, a
        // repeatable job added by a deploy last year keeps
        // firing after you delete its code, and the worker has
        // no handler for it, so it fails forever in the DLQ.
      }
    }
  }

  for (const s of SCHEDULES) {
    await QUEUES[s.queue].upsertJobScheduler(
      s.name,
      { pattern: s.pattern, tz: s.tz },
      //                     ^^^^^^^ ⚠ explicit. Without a tz
      //                     this runs in the PROCESS's zone,
      //                     so your laptop and your container
      //                     disagree about 02:00 and nobody
      //                     notices until a report arrives at
      //                     a strange hour.
      { name: s.name, data: s.data },
    );
  }
}

// Called once, from a single place, and not from every API
// instance.
// scripts/sync-schedules.js — a deploy step, like migrations
await syncSchedules();
await Promise.all(Object.values(QUEUES).map((q) => q.close()));
//
// Day 17's rule about migrations applies: run it as a deploy
// step, not at boot from every replica, or four instances race
// to reconcile the same schedule.


// ── ⚠ Missed runs: decide, do not discover ──────────────────
// The system was down from 01:00 to 06:00. What should have
// happened at 02:00?
//
//   "send the daily digest"
//     → skip it. A digest at 06:00 covering yesterday is
//       fine; two digests are not.
//
//   "charge monthly subscriptions"
//     → run it. Skipping means nobody is billed this month,
//       and that error is far more expensive than lateness.
//
//   "prune expired sessions"
//     → skip it. The next run cleans everything anyway.
//
// So express it in the job rather than hoping the scheduler
// agrees with you:
const worker = new Worker("reports", async (job) => {
  if (job.name === "daily-report") {
    // The schedule fired for a nominal time. Work out which
    // day this run is FOR, rather than assuming it is now.
    const targetDate = job.data.date
      ?? new Date(job.timestamp - 2 * 3600_000).toISOString().slice(0, 10);

    // Skip if it is far too late for this to be useful, and
    // say so rather than silently doing nothing.
    const hoursLate = (Date.now() - job.timestamp) / 3600_000;
    if (hoursLate > 12) {
      log().warn({ targetDate, hoursLate }, "daily report too late, skipping");
      return { skipped: "too_late" };
    }

    // Day 24's idempotency: a unique constraint on the date, so
    // a late run plus a manual run cannot double up.
    await generateDailyReport(db, targetDate);
  }
}, { connection });
//
// The general rule: a scheduled job should compute WHAT PERIOD
// IT IS FOR from its nominal time, never from Date.now(). A
// job that assumes "now" produces a report for the wrong day
// the first time it runs late, and that bug is invisible until
// somebody reconciles the numbers.


// ── The architecture, stated ────────────────────────────────
//   deploy step        →  syncSchedules()          once
//   Redis              →  holds the schedule
//   BullMQ             →  fires one job per window
//   worker processes   →  do the work, any number
//
// Nothing in your API process schedules anything, which is the
// property that makes it safe to run twenty replicas.`,
      },
      keyTakeaways: [
        "Use the queue's delay rather than `setTimeout`, because a timer lives in one process's memory and dies with the next deploy.",
        "A delayed job needs a deterministic id, so you can cancel it when the reason for it goes away.",
        "A reminder that arrives after the user already acted reads as a broken product, and cancelling is the half people forget.",
        "Cron inside your API runs once per instance, so a daily report runs four times on four replicas.",
        "Worse than duplication: concurrent copies of a job never written for concurrency can produce interleaved partial results.",
        "This is the third instance of the same bug: in-memory sessions, an in-process rate limiter, and now a per-process schedule.",
        "A repeatable job stored in Redis fires once regardless of how many workers are connected, which separates deciding when from doing the work.",
        "The cost is that the schedule now lives outside your repository and can drift from it.",
        "Reconcile schedules at deploy time and remove ones no longer declared, or a deleted job keeps firing with no handler.",
        "Set the timezone explicitly, or a cron expression runs in the process's zone and your laptop and container disagree about 02:00.",
        "Decide what a missed run should do. \"Skip the digest\" and \"still charge subscriptions\" are different answers.",
        "A scheduled job should compute the period it is for from its nominal time, never from `Date.now()`, or the first late run reports on the wrong day.",
        "Run schedule reconciliation as a deploy step like migrations, not at boot from every replica.",
      ],
      commonMistakes: [
        "`setTimeout` for anything longer than a request, which dies with the next deploy and is per instance anyway.",
        "A delayed job with no deterministic id, so it cannot be cancelled when it becomes irrelevant.",
        "Never cancelling a scheduled reminder, so users who already acted receive it anyway.",
        "`node-cron` inside the API process, which fires once per replica.",
        "Assuming duplicate scheduled runs are harmless, when concurrent copies can interleave and corrupt output.",
        "Registering schedules at boot from every instance, so replicas race to reconcile.",
        "Never removing undeclared schedules, so a deleted job fires forever into the dead-letter queue.",
        "Omitting the timezone, so the schedule follows the process's zone rather than a deliberate one.",
        "No decision about missed runs, so the behaviour is whatever the scheduler happens to do.",
        "Using `Date.now()` inside a scheduled job, which reports on the wrong period the first time it runs late.",
      ],
      quiz: [
        {
          question: "Why use a queue delay instead of `setTimeout` for a 24-hour reminder?",
          options: [
            "It is more precise",
            "A timer lives in one process's memory and dies with the next deploy, which is usually hours away, and it is per instance",
            "`setTimeout` has a maximum delay",
            "Queues are faster",
          ],
          correctIndex: 1,
          explanation:
            "A delayed job is a row or a Redis entry, so it survives restarts. It also needs a deterministic id so you can cancel it.",
        },
        {
          question: "What is worse than duplication when cron runs inside four API replicas?",
          options: [
            "Nothing, duplication is the problem",
            "The four runs are concurrent, and a job never written for concurrency can produce interleaved partial results",
            "Redis rejects the writes",
            "The instances deadlock",
          ],
          correctIndex: 1,
          explanation:
            "Four identical reports is easier to diagnose than four partial ones. It is the same per-process bug as in-memory sessions.",
        },
        {
          question: "What is the hidden cost of storing schedules in Redis?",
          options: [
            "Memory",
            "The schedule lives outside your repository, so a job deleted from the code keeps firing with no handler until you remove it",
            "It fires late",
            "Only one worker can consume it",
          ],
          correctIndex: 1,
          explanation:
            "Reconcile at deploy time: register what you declare and remove what you no longer do, with a log line when you remove something.",
        },
        {
          question: "Why set the timezone explicitly on a cron pattern?",
          options: [
            "For daylight saving only",
            "Without it the expression runs in the process's timezone, so a container in UTC and a laptop elsewhere disagree about when 02:00 is",
            "Redis requires it",
            "To support multiple regions",
          ],
          correctIndex: 1,
          explanation:
            "Prefer UTC for anything not user-facing, and make it a property of the declared schedule rather than an accident of the environment.",
        },
        {
          question: "Why should a scheduled job not use `Date.now()` to decide what it is working on?",
          options: [
            "Clock skew",
            "The first time it runs late it reports on the wrong period. Compute the target from the job's nominal time instead.",
            "`Date.now()` is not monotonic",
            "It breaks idempotency keys",
          ],
          correctIndex: 1,
          explanation:
            "That bug is invisible until somebody reconciles the numbers, which is long after the run that caused it.",
        },
      ],
    },
    {
      id: "worker-shutdown",
      title: "Graceful worker shutdown",
      durationMinutes: 11,
      explanation:
        "## Graceful shutdown\n\n<b>Graceful shutdown</b> (stopping new work while letting current work finish).\n\n```text\nSIGTERM → stop taking jobs → finish active jobs → close Redis → exit\n```\n\n> Day 21 did this for a web server and the worker case has a different shape. A web server drains requests that take milliseconds; a worker may be forty seconds into a PDF. So the question is not just <b>how</b> to drain but <b>whether you can</b>, and the answer depends on your orchestrator's grace period.\n\n---\n\n## What killing a worker actually costs\n\n> A killed worker does not lose the job, which is the good news: the previous lessons' stalled-job recovery returns it to the queue. The cost is that the job <b>runs again from the start</b>.\n>\n> For an idempotent job that is a wasted minute. For a job that had already sent three of five emails in a loop, it is three people getting a second copy. So the real reason to shut down gracefully is not correctness, which idempotency owns, it is <b>avoiding repeated work and duplicate visible effects</b>.\n\n---\n\n## The grace period is the constraint\n\n> Kubernetes sends `SIGTERM`, waits `terminationGracePeriodSeconds`, then sends `SIGKILL`. The default is 30 seconds. So a worker running 45-second jobs cannot finish them, and no amount of shutdown code changes that: it will be killed mid-job on every deploy.\n>\n> Two real fixes. Raise the grace period beyond your worst-case job. Or make long jobs <b>checkpointable</b>, so a re-run resumes rather than restarting, which is the only approach that survives a `SIGKILL`.\n\n---\n\n## The order matters\n\n```text\n1  stop accepting new jobs      worker.close() does this first\n2  let active jobs finish       bounded by the grace period\n3  close the Redis connection\n4  close the database pool\n5  flush telemetry\n6  exit 0\n```\n\n> The mistake is closing Redis before jobs finish. An active job that completes then cannot report its result, so it looks stalled and gets re-run, which is exactly the outcome you were shutting down carefully to avoid.\n\n---\n\n## Deploys are the common case\n\n> This is not an edge case, it is <b>every deploy</b>. If you deploy ten times a week and workers are killed mid-job each time, you are generating duplicate work ten times a week and calling it normal.\n>\n> Which is why the honest advice is: keep individual jobs <b>short</b>. A job that takes 45 seconds is hard to shut down, hard to lock correctly and hard to retry cheaply. Splitting it into fifteen three-second jobs makes all three problems disappear, and the queue is designed to handle that many.",
      diagram: `Graceful shutdown, worker edition

    SIGTERM
      → stop taking jobs
      → finish active jobs
      → close Redis
      → exit

    Day 21 did this for a WEB SERVER. the worker
    case is different:

      a web server drains requests taking
      MILLISECONDS

      a worker may be FORTY SECONDS into a PDF

    so the question is not just HOW to drain but
    WHETHER YOU CAN, and that depends on your
    orchestrator's grace period.


What killing a worker actually costs

    it does NOT lose the job. stalled-job recovery
    returns it to the queue.

    the cost is that the job RUNS AGAIN FROM THE
    START.

      idempotent job        a wasted minute
      a loop that had sent
      3 of 5 emails         THREE PEOPLE GET A
                            SECOND COPY

    → so the real reason to shut down gracefully
      is not CORRECTNESS, which idempotency owns.

      it is avoiding REPEATED WORK and DUPLICATE
      VISIBLE EFFECTS.


⚠⚠ The grace period is the constraint

    Kubernetes sends SIGTERM, waits
    terminationGracePeriodSeconds, then SIGKILL.

    THE DEFAULT IS 30 SECONDS.

    so a worker running 45-second jobs CANNOT
    FINISH THEM, and no shutdown code changes
    that. it will be killed mid-job on every
    deploy.

    two real fixes:

      RAISE the grace period beyond your
      worst-case job

      make long jobs CHECKPOINTABLE, so a re-run
      RESUMES rather than restarting

        ↳ the only approach that survives SIGKILL


⚠ The order matters

    1  stop accepting new jobs
         worker.close() does this first
    2  let active jobs finish
         bounded by the grace period
    3  close Redis
    4  close the database pool
    5  flush telemetry
    6  exit 0

    the mistake is CLOSING REDIS BEFORE JOBS
    FINISH.

      an active job that completes then cannot
      report its result

      → it looks STALLED and gets RE-RUN

      → exactly the outcome you were shutting
        down carefully to avoid


⚠ Deploys are the common case

    this is not an edge case. it is EVERY DEPLOY.

    deploy ten times a week, kill workers mid-job
    each time, and you are generating duplicate
    work ten times a week and calling it normal.

    → which is why the honest advice is:

      KEEP INDIVIDUAL JOBS SHORT.

      a 45-second job is hard to shut down, hard
      to lock correctly and hard to retry cheaply.

      fifteen three-second jobs makes all three
      problems disappear, and the queue is
      designed to handle that many.`,
      codeExample: {
        title: "A worker shutdown that does not duplicate work",
        code: `// ── src/workers/pdf.js ──────────────────────────────────────
import { Worker } from "bullmq";

const worker = new Worker("pdf", handler, {
  connection,
  concurrency: 2,
  lockDuration: 60_000,
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log().info({ signal }, "worker shutdown requested");

  const started = Date.now();

  // 1. Stop taking new jobs, and wait for active ones.
  //    close() does both: it stops the fetch loop first, then
  //    resolves when active jobs finish.
  await worker.close();
  //    ^^^^^^^^^^^^^^ NOT worker.close(true), which forces
  //    active jobs to be abandoned immediately. That is the
  //    thing you are trying to avoid.

  log().info({ ms: Date.now() - started }, "active jobs drained");

  // 2. Only NOW close the connections the jobs were using.
  await Promise.allSettled([
    redis.quit(),
    workerDb.$client.end(),
  ]);

  // 3. Telemetry last, so the shutdown itself is recorded.
  await sdk.shutdown().catch(() => {});

  process.exit(0);
  //           ^ zero. Day 22: a requested shutdown is not a
  //           failure, and a non-zero exit here shows every
  //           deploy as a crash.
}

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => shutdown(signal));
}


// ── ⚠ The ordering mistake ──────────────────────────────────
// ✗
process.on("SIGTERM", async () => {
  await redis.quit();          // ← closed first
  await worker.close();
});
//
// A job that was 30 seconds into a 40-second render finishes,
// tries to report completion, and cannot: its connection is
// gone. BullMQ never sees the completion, the lock expires,
// the job is treated as stalled, and a new worker runs it from
// the beginning.
//
// You wrote shutdown code and produced exactly the duplicate
// work it was meant to prevent.


// ── ⚠⚠ The grace period is the real limit ───────────────────
// deployment.yaml
// spec:
//   template:
//     spec:
//       terminationGracePeriodSeconds: 30    ← the DEFAULT
//
// A worker whose jobs take 45 seconds:
//
//   t=0   SIGTERM. worker.close() waits for the active job.
//   t=30  SIGKILL. The process is gone mid-render.
//   t=90  Lock expires. Job is stalled and re-queued.
//   t=90  Another worker starts it from scratch.
//
// Every deploy. The shutdown handler ran and achieved nothing,
// because 30 seconds was never enough.
//
// ✓ Fix 1: match the grace period to the work.
// spec:
//   terminationGracePeriodSeconds: 120
//
// Simple, and it makes every deploy slower by up to two
// minutes per worker pod. Usually the right trade.

// ✓ Fix 2: make the job checkpointable, which is the only
//   thing that survives SIGKILL.
const worker = new Worker("import-csv", async (job) => {
  const { importId } = job.data;

  // Resume from where a previous attempt stopped.
  const [state] = await db.select().from(imports)
    .where(eq(imports.id, importId));

  let row = state.processedRows ?? 0;
  const total = state.totalRows;

  for (; row < total; row++) {
    if (shuttingDown) {
      // Save progress and hand the job back deliberately.
      await db.update(imports).set({ processedRows: row })
        .where(eq(imports.id, importId));
      log().info({ importId, row }, "checkpointed for shutdown");
      throw new Error("shutting down, will resume");
      //    ^^^ throwing means BullMQ retries it, and the retry
      //    resumes from row N rather than from zero
    }

    await importRow(db, importId, row);

    // Checkpoint periodically, so even a SIGKILL loses at most
    // 100 rows of work.
    if (row % 100 === 0) {
      await db.update(imports).set({ processedRows: row })
        .where(eq(imports.id, importId));
      await job.updateProgress(Math.round((row / total) * 100));
    }
  }

  await db.update(imports)
    .set({ processedRows: total, status: "complete" })
    .where(eq(imports.id, importId));
}, { connection });
//
// Now a kill at any point costs at most 100 rows, not the
// whole import, and the job is idempotent per row rather than
// per job, which is a much easier property to hold.


// ── ✓ And the advice that removes the problem ───────────────
// ✗ One job that takes 45 seconds:
await pdfQueue.add("generate-report", { month });

// ✓ Many jobs that take three seconds each:
await pdfQueue.add("report:start", { month });
// then the handler fans out:
const worker = new Worker("pdf", async (job) => {
  if (job.name === "report:start") {
    const sections = await planSections(db, job.data.month);

    await pdfQueue.addBulk(sections.map((s) => ({
      name: "report:section",
      data: { month: job.data.month, section: s.id },
      opts: { jobId: \`report:\${job.data.month}:\${s.id}\` },
      //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Day 24's
      //             idempotency: a deterministic id per section
    })));
    return;
  }

  if (job.name === "report:section") {
    await renderSection(db, job.data.month, job.data.section);
    // The last section to finish assembles the report.
    if (await allSectionsDone(db, job.data.month)) {
      await pdfQueue.add("report:assemble", { month: job.data.month });
    }
  }
}, { connection });
//
// Three problems solved at once:
//
//   shutdown    a three-second job finishes inside any grace
//               period
//   locking     lockDuration no longer has to guess at 45
//               seconds  (Day 24's stalled-job lesson)
//   retries     a failure re-runs one section, not the whole
//               report
//
// The queue is designed for many small jobs. Splitting work
// is usually cheaper than engineering around a long one.


// ── Verify it, because shutdown code is never exercised ─────
// $ node src/workers/pdf.js &
// $ kill -TERM %1
//
// Expected log sequence:
//   worker shutdown requested        signal=SIGTERM
//   active jobs drained              ms=8412
//   (exit 0)
//
// And the check that matters: the job that was active
// completed, and the queue shows it as completed rather than
// re-queued.
//
// Test it once per project. Shutdown code that has never been
// run is shutdown code that does not work, and you find out
// during a deploy.`,
      },
      keyTakeaways: [
        "A killed worker does not lose the job, because stalled-job recovery re-queues it. The cost is that it runs again from the start.",
        "So the reason to shut down gracefully is avoiding repeated work and duplicate visible effects, not correctness, which idempotency owns.",
        "A loop that had sent three of five emails means three people get a second copy on the re-run.",
        "The grace period is the real constraint. Kubernetes defaults to 30 seconds, so 45-second jobs are killed mid-work on every deploy.",
        "No shutdown code fixes that. Either raise the grace period beyond your worst case, or make the job checkpointable.",
        "Checkpointing is the only approach that survives `SIGKILL`, and it makes the job idempotent per unit rather than per job.",
        "Order matters: `worker.close()` first, then Redis, then the database pool, then telemetry, then exit 0.",
        "Closing Redis before jobs finish means a completing job cannot report its result, so it looks stalled and is re-run.",
        "Use `worker.close()` and not `close(true)`, which abandons active jobs immediately.",
        "Exit 0 for a requested shutdown, or every deploy appears as a crash.",
        "This is every deploy, not an edge case. Ten deploys a week means duplicate work ten times a week.",
        "The best fix is short jobs. Splitting a 45-second job into fifteen three-second jobs solves shutdown, locking and retry cost at once.",
        "Test the shutdown path once per project, because code that has never run is code that does not work.",
      ],
      commonMistakes: [
        "Closing Redis or the database before active jobs finish, so a completing job cannot report and is re-run.",
        "Using `worker.close(true)`, which abandons active jobs and produces the duplication you were avoiding.",
        "Leaving the grace period at 30 seconds with 45-second jobs, so the shutdown handler runs and achieves nothing.",
        "Exiting non-zero on a requested shutdown, making every deploy look like a crash.",
        "Assuming a graceful shutdown protects correctness. It reduces duplicate work; idempotency is what makes the duplicate safe.",
        "Long jobs with no checkpointing, so a kill discards minutes of work.",
        "Treating mid-job kills as an edge case when they happen on every deploy.",
        "Never testing the shutdown path, so it is first exercised during a real deploy.",
      ],
      quiz: [
        {
          question: "What does killing a worker mid-job actually cost?",
          options: [
            "The job is lost",
            "The job is re-queued and runs again from the start, so repeated work and any duplicate visible effects",
            "The queue stalls",
            "Redis loses the lock permanently",
          ],
          correctIndex: 1,
          explanation:
            "Correctness is idempotency's job. Graceful shutdown is about avoiding the repeated work and the second copy of three emails.",
        },
        {
          question: "Why can shutdown code fail to help a worker with 45-second jobs?",
          options: [
            "Because `close()` is async",
            "Kubernetes' default grace period is 30 seconds, so `SIGKILL` arrives mid-job regardless of what the handler does",
            "Because Redis disconnects first",
            "Because BullMQ ignores SIGTERM",
          ],
          correctIndex: 1,
          explanation:
            "Raise the grace period beyond your worst case, or make the job checkpointable, which is the only thing that survives a kill.",
        },
        {
          question: "What goes wrong if you close Redis before active jobs finish?",
          options: [
            "Nothing",
            "A completing job cannot report its result, so it looks stalled and gets re-run, producing the duplication you were avoiding",
            "Redis refuses to close",
            "The process hangs",
          ],
          correctIndex: 1,
          explanation:
            "`worker.close()` first, then the connections the jobs were using.",
        },
        {
          question: "What is the best structural fix for hard-to-shutdown jobs?",
          options: [
            "A longer lock duration",
            "Shorter jobs. Splitting a 45-second job into fifteen three-second jobs fixes shutdown, lock duration and retry cost at once.",
            "More concurrency",
            "A second Redis",
          ],
          correctIndex: 1,
          explanation:
            "The queue is designed for many small jobs, and splitting is usually cheaper than engineering around a long one.",
        },
        {
          question: "Why exit 0 rather than 1 after a graceful worker shutdown?",
          options: [
            "It is faster",
            "A requested shutdown is not a failure, and a non-zero exit makes every routine deploy appear as a crash in your dashboards",
            "The orchestrator requires it",
            "To skip the restart",
          ],
          correctIndex: 1,
          explanation:
            "Day 22's distinction: 1 for a fatal error, 0 for a shutdown you were asked to perform.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the bigger benefit of moving an email out of a signup request?",
      options: [
        "The latency saving",
        "Signup stops failing because of the email provider. Inline, a 500 leaves a created account with a failed response and a retry that says \"already registered\".",
        "Fewer queries",
        "Cleaner code",
      ],
      correctIndex: 1,
      explanation:
        "The latency is visible; the coupled failure is what leaves a user unable to sign up or log in.",
    },
    {
      question: "What do you owe the user after returning 202 for queued work?",
      options: [
        "Nothing",
        "A way to find out what happened: a status URL, a notification, or a visible state on the record",
        "A faster response",
        "A retry endpoint",
      ],
      correctIndex: 1,
      explanation:
        "`{ success: true }` for work that has not happened is worse than the slow version, because the user believes it finished.",
    },
    {
      question: "Why does it matter that a worker is a separate process?",
      options: [
        "Code organisation",
        "It scales, restarts and crashes independently, and job work does not share the API's event loop",
        "Redis requires it",
        "For logging",
      ],
      correctIndex: 1,
      explanation:
        "A worker created inside `server.js` means a CPU-bound job blocks requests and workers cannot scale without web servers.",
    },
    {
      question: "What is the real argument for a Postgres-backed queue?",
      options: [
        "Fewer services",
        "Transactional enqueue: the job insert is part of your transaction, so there is no gap between commit and enqueue",
        "Speed",
        "Better UI",
      ],
      correctIndex: 1,
      explanation:
        "With Redis you must choose between losing a job on a crash and enqueueing one for a rolled-back row.",
    },
    {
      question: "With a Redis queue, what does committing before enqueueing require?",
      options: [
        "Nothing extra",
        "A sweep for rows stuck in a pending state, because a crash between the two loses the job with no error anywhere",
        "A distributed lock",
        "A longer TTL",
      ],
      correctIndex: 1,
      explanation:
        "That is the transactional outbox pattern, and the sweep's count is worth alerting on because it means the gap is being hit.",
    },
    {
      question: "Why put identifiers rather than objects in job data?",
      options: [
        "Size limits",
        "Serialisation changes the shape, the values are a snapshot from enqueue time, and payload times depth is real memory",
        "Objects cannot serialise",
        "Faster parsing",
      ],
      correctIndex: 1,
      explanation:
        "Day 23's `Date`-becomes-a-string finding applies exactly, and the worker reloading by id sees current data.",
    },
    {
      question: "What does a queue do by default when your job throws?",
      options: [
        "Fails it permanently",
        "Retries it, so an error you meant as permanent becomes several attempts unless you use something like `UnrecoverableError`",
        "Drops it",
        "Pauses the queue",
      ],
      correctIndex: 1,
      explanation:
        "Give a job two exits: throw for transient failures, return after recording permanent ones.",
    },
    {
      question: "Why does jitter matter more in a queue than in an HTTP client?",
      options: [
        "Jobs are bigger",
        "A provider outage makes thousands of jobs fail within seconds, so they all schedule the same retry time and arrive together",
        "Queues retry faster",
        "Redis batches them",
      ],
      correctIndex: 1,
      explanation:
        "Day 22 measured 1 distinct retry time across 1000 clients without jitter, and BullMQ's exponential backoff adds none.",
    },
    {
      question: "What does a dead-letter queue need beyond existing?",
      options: [
        "Longer retention",
        "A metric, an alert on sustained growth, and a way to replay after fixing the cause",
        "A separate Redis",
        "A schema",
      ],
      correctIndex: 1,
      explanation:
        "Without the replay path, fixing the bug helps future jobs and does nothing for the work already lost.",
    },
    {
      question: "A job takes 45 seconds and `lockDuration` is 30 seconds. What happens?",
      options: [
        "The lock extends automatically",
        "The lock expires, the job is treated as stalled, and a second worker runs it while the first is still going",
        "The job fails",
        "The worker is killed",
      ],
      correctIndex: 1,
      explanation:
        "Day 23's lock-TTL problem again. Extend the lock while working, and accept that it narrows rather than closes the window.",
    },
    {
      question: "Why can a queue not offer exactly-once delivery?",
      options: [
        "Implementation limits",
        "It only knows whether your function returned, not whether your side effect happened, and a crash can land in the gap",
        "Redis is not durable",
        "Network partitions",
      ],
      correctIndex: 1,
      explanation:
        "So the model is that every job will eventually run twice, and the design question is whether that is uneventful.",
    },
    {
      question: "What is wrong with an idempotency key that includes the attempt number?",
      options: [
        "Length",
        "Attempt 1 and 2 have different keys by construction, so retries are exactly what it fails to deduplicate",
        "Providers reject it",
        "Nothing",
      ],
      correctIndex: 1,
      explanation:
        "The test is whether the key would be identical if the job ran again for any reason. Derive it from the data.",
    },
    {
      question: "Should a job record the payment before or after charging?",
      options: [
        "Before",
        "After. A crash then leaves a charge with no record, reconcilable from the provider, rather than a record of money you never took.",
        "It does not matter",
        "In one transaction",
      ],
      correctIndex: 1,
      explanation:
        "Both orders lose something. Pick the one where what you lose is recoverable from somebody else's records.",
    },
    {
      question: "What does raising concurrency do for a CPU-bound job?",
      options: [
        "Multiplies throughput",
        "Almost nothing. Ten renders on one event loop take turns, each ten times slower with no extra throughput.",
        "Halves memory",
        "Reduces lock contention",
      ],
      correctIndex: 1,
      explanation:
        "Scale CPU-bound work with more processes or a worker thread. Getting this backwards makes a queue slower when you tune it.",
    },
    {
      question: "Why is raw queue depth the wrong alert?",
      options: [
        "Hard to measure",
        "A healthy queue is often deep during a burst, so it fires on every nightly batch and gets muted before it matters",
        "It lags",
        "Depth is always zero",
      ],
      correctIndex: 1,
      explanation:
        "Alert on the oldest waiting job's age instead, which fires on a stuck queue of 50 and stays quiet on a healthy queue of 50,000.",
    },
    {
      question: "Why do you need a worker heartbeat metric?",
      options: [
        "Load balancing",
        "A queue with 5,000 waiting jobs and no worker connected looks identical in Redis to a busy one",
        "To restart workers",
        "For latency",
      ],
      correctIndex: 1,
      explanation:
        "\"Nobody is processing this\" and \"this is slow\" need different alerts, because one is a failed deploy and one is capacity.",
    },
    {
      question: "What is wrong with `node-cron` inside four API replicas?",
      options: [
        "It is imprecise",
        "It fires once per instance, so the job runs four times, and concurrent copies of a job not written for concurrency can interleave",
        "It blocks the event loop",
        "Nothing",
      ],
      correctIndex: 1,
      explanation:
        "The same per-process bug as Day 21's in-memory sessions and Day 19's in-process rate limiter.",
    },
    {
      question: "What is the hidden cost of storing schedules in Redis?",
      options: [
        "Memory",
        "The schedule lives outside your repository, so a job deleted from the code keeps firing with no handler until you remove it",
        "Late firing",
        "One consumer only",
      ],
      correctIndex: 1,
      explanation:
        "Reconcile at deploy time: register what you declare and remove what you no longer do.",
    },
    {
      question: "Why should a scheduled job not use `Date.now()` for the period it works on?",
      options: [
        "Clock skew",
        "The first time it runs late it reports on the wrong period. Compute the target from the job's nominal time instead.",
        "It is not monotonic",
        "It breaks the key",
      ],
      correctIndex: 1,
      explanation:
        "That bug is invisible until somebody reconciles the numbers, long after the run that caused it.",
    },
    {
      question: "What goes wrong if a worker closes Redis before its active jobs finish?",
      options: [
        "Nothing",
        "A completing job cannot report its result, so it looks stalled and gets re-run, producing exactly the duplication you were avoiding",
        "Redis refuses",
        "The process hangs",
      ],
      correctIndex: 1,
      explanation:
        "`worker.close()` first, then the connections the jobs were using, then telemetry, then exit 0.",
    },
  ],
  project: {
    name: "day-24",
    goal: "Build a queue, a separate worker and a scheduler, then break each one on purpose: lose a job in the enqueue gap, run a job twice from a stalled lock, fire a schedule from three instances, and kill a worker mid-job.",
    brief:
      "Background jobs look simple until the failure modes arrive, and all four of them are things you can reproduce in ten minutes each. Lose a job by crashing between the commit and the enqueue, then build the sweep that recovers it. Set a lock shorter than the job and watch two workers run the same work with no error anywhere. Run three copies of your API with node-cron and count the reports. Then kill a worker mid-job and see what a re-run costs. Every fix in this day is a response to one of those four, so do them before you write the fix.",
    steps: [
      "Create `day-24/` with `\"type\": \"module\"` and install `fastify`, `bullmq`, `ioredis`, `zod`, `drizzle-orm` and `pg`. Start Redis with Docker.",
      "Use a separate Redis database for jobs, with no eviction policy, and note in a comment why it must not share the cache database.",
      "Write `POST /signup` that creates a user inline and queues a welcome email, returning 202 with a status URL.",
      "Write the worker as a separate file with its own npm script, and confirm the API and worker are two processes.",
      "Add `welcome_email_status` to the users table and have the worker update it, then confirm the status endpoint reflects it.",
      "Enqueue a whole user object, log what the worker receives, and record which fields changed type.",
      "Change it to an id and have the worker reload, then note what else that fixed.",
      "Reproduce the enqueue gap: commit the user, then `process.exit(1)` before the enqueue. Confirm the user exists with no job and no error anywhere.",
      "Write the sweep that re-enqueues pending welcomes older than a minute, with a deterministic `jobId`, and confirm it recovers the lost user.",
      "Log the sweep's count and decide what threshold would deserve an alert.",
      "Make the email handler fail twice then succeed, and record the attempt timestamps.",
      "Compare the retry delays with plain exponential backoff and with a jittered custom strategy, running 50 jobs that all fail at once.",
      "Add a permanent failure path using `UnrecoverableError` for an undeliverable address, and confirm it does not retry.",
      "Check the failed set after both kinds of failure and note which jobs are there.",
      "Write a replay endpoint behind an admin permission that retries failed jobs, skipping the permanently failed ones.",
      "Set `lockDuration` to 5 seconds and a job that takes 15, then run two workers and count how many times the work happens.",
      "Add lock extension and repeat, then state what it fixed and what it did not.",
      "Make the job idempotent with a unique constraint, repeat the stalled-lock test, and confirm the side effect happens once.",
      "Write the test that calls the handler twice with different job ids and asserts one side effect.",
      "Try an idempotency key derived from `job.id`, rerun that test, and confirm it fails.",
      "Add a CPU-bound job, run it at concurrency 1 and at concurrency 10, and record throughput and p95 per job for both.",
      "Compute your total database connections across API replicas and worker concurrency, and set a smaller worker pool.",
      "Add a rate-limited fake provider allowing 20 requests a minute, queue 500 jobs with no limiter, and count the 429s.",
      "Add the queue limiter and repeat, then record the difference.",
      "Add metrics for waiting, active, failed and oldest waiting age, plus a worker heartbeat.",
      "Stop the worker with 200 jobs queued and confirm depth alone does not distinguish that from busy, while the heartbeat does.",
      "Add `node-cron` to your API, run three instances, and count how many daily reports were generated.",
      "Replace it with a BullMQ repeatable job and confirm one run across three workers.",
      "Add a schedule to Redis, delete it from your code, restart, and confirm it still fires. Then write the reconciliation that removes it.",
      "Set a cron pattern without a timezone, change your process timezone, and confirm the fire time moves.",
      "Write a scheduled job that derives its target date from `job.timestamp` rather than `Date.now()`, then fire it late and confirm it reports the right period.",
      "Schedule a 24-hour reminder with a deterministic id, then cancel it and confirm it does not fire.",
      "Write the graceful shutdown handler in the correct order and confirm the log sequence with `kill -TERM`.",
      "Reverse the order so Redis closes first, kill the worker mid-job, and confirm the job is re-run.",
      "Set a job to take 45 seconds, set a 30-second grace period, and confirm the job is killed and re-run from the start.",
      "Rewrite that job to checkpoint every 100 units and confirm a kill loses at most 100 units of work.",
      "Split the long job into many short ones with deterministic ids and note which three problems that solved.",
    ],
    acceptance: [
      "The API and worker are separate processes with separate npm scripts, and jobs use a Redis database with no eviction policy.",
      "You recorded which fields changed type when a whole object was enqueued.",
      "You reproduced the enqueue gap and can state that no error appeared anywhere.",
      "The sweep recovers the lost user, uses a deterministic `jobId`, and logs a count you would alert on.",
      "You have the retry timestamps for 50 simultaneously failing jobs with and without jitter.",
      "A permanent failure does not retry, and the failed set distinguishes the two kinds.",
      "The replay endpoint retries failed jobs and skips permanently failed ones.",
      "With a 5-second lock and a 15-second job, you counted the work happening more than once.",
      "After adding a unique constraint, the same test produces one side effect.",
      "The double-run test fails when the idempotency key comes from `job.id` and passes when it comes from the data.",
      "You have throughput and p95 numbers for a CPU-bound job at concurrency 1 and 10, and can explain them.",
      "Your connection arithmetic is written down and worker pools are smaller than the API's.",
      "You have the 429 counts with and without the queue limiter.",
      "Stopping the worker leaves depth unchanged while the heartbeat metric goes absent.",
      "Three API instances with `node-cron` produced three reports, and the repeatable job produced one.",
      "An undeclared schedule still fired until the reconciliation removed it, with a log line.",
      "Changing the process timezone moved the fire time of a pattern with no `tz`.",
      "A late scheduled run reports on the correct period because it uses the nominal time.",
      "A cancelled reminder does not fire.",
      "`kill -TERM` produces the expected shutdown log sequence and the active job completes.",
      "With Redis closed first, the active job is re-run, and you can explain why.",
      "With a 30-second grace period and a 45-second job, the job is killed and re-run from the start.",
      "The checkpointed version loses at most 100 units on a kill.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Reimplement the same flow with pg-boss and enqueue inside the transaction, then confirm a rollback leaves no job.",
      "Compare the two implementations on job throughput and on the amount of reconciliation code each needs.",
      "Add job priorities and confirm a high-priority job jumps a deep queue of normal ones.",
      "Add a flow where one job fans out to many and a final job assembles the result.",
      "Add per-job-name duration histograms and find the job type responsible for your queue depth.",
      "Add a circuit breaker from Day 22 in front of the fake provider and confirm the queue drains rather than storming when it is down.",
      "Implement an outbox table with a dedicated publisher process, and compare it with the sweep.",
      "Add a Bull Board or equivalent UI and decide whether you would expose it in production, referring to Day 19.",
      "Measure the wall-clock cost of a deploy with a 30-second versus a 120-second grace period across four worker pods.",
      "Write a test that fails if any worker file is imported from `server.js`.",
    ],
  },
};
