import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_26_LESSONS: LessonDay = {
  day: 26,
  title: "Queues & jobs — batching, retries, failures & Horizon",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "why-queues",
      title: "Why queues exist, and what a job is",
      durationMinutes: 11,
      explanation: "One idea, and everything today follows from it:\n\n> <b>Do not make the user wait for work that does not need to happen during the request.</b>\n\n---\n\n### 1. Basic — the problem\n\nSomebody uploads a podcast. Without a queue:\n\n```text\nupload\n  ↓\nprocess the audio\n  ↓\ngenerate a waveform\n  ↓\ngenerate a transcript\n  ↓\nsend a notification\n  ↓\nHTTP response\n```\n\nThirty seconds of staring at a spinner, and a PHP worker occupied for all of it. Ten uploads at once and the site is unresponsive for everybody.\n\nWith a queue:\n\n```text\nupload\n  ↓\nsave the podcast\ndispatch a job\n  ↓\nHTTP response          ← immediately\n```\n\nand separately:\n\n```text\nQueue → Worker → process → waveform → transcript → notify\n```\n\n<b>The request does the minimum that must be true before answering</b>, and everything else happens after.\n\nThat framing is the useful one. The question is not \"is this slow\", it is <b>does the user need this to have finished before they get a response?</b>\n\n---\n\n### 2. Intermediate — a job\n\n<b>A <i>job</i></b> is a unit of work Laravel can run later:\n\n```text\nProcessPodcast · SendInvoice · ResizeImage\nSendWelcomeEmail · GenerateReport · SyncCustomer\n```\n\nIt is two things:\n\n```text\nthe data it needs\n       +\na handle() method\n```\n\n```bash\nphp artisan make:job ProcessPodcast\n```\n\n```php\nclass ProcessPodcast implements ShouldQueue\n{\n    public function __construct(public Podcast $podcast) {}\n\n    public function handle(): void\n    {\n        $this->podcast->process();\n    }\n}\n```\n\n<b>`ShouldQueue` is what makes it a queued job</b> rather than something dispatched and run immediately.\n\nAnd the distinction to hold on to:\n\n```text\ndispatch()   put the job in the queue\nhandle()     actually do the work, later, elsewhere\n```\n\n---\n\n### 3. Advanced — the constructor is the wire\n\n```php\nProcessPodcast::dispatch($podcast);\n```\n\n```text\napplication → dispatch() → the queue → a worker → handle()\n```\n\nAnd here is the thing that explains most job bugs. <b>Everything in the constructor is serialised, stored, and deserialised later, in a different process.</b>\n\nThree consequences.\n\n<b>Models are stored as an id, not as data.</b> Laravel re-fetches the model when the job runs, which is usually what you want and occasionally not: if the row was deleted in the meantime, the job fails to find it.\n\n<b>The job runs against the state at execution time, not at dispatch time.</b> Dispatch a job to email an invoice, edit the invoice, and the email contains the edit. Sometimes correct, sometimes a surprise, and always worth knowing which you meant.\n\n<b>And whatever you pass must be serialisable.</b> A closure, a request, or an open file handle cannot cross that boundary. Pass ids and simple values, and look up the rest inside `handle()`.\n\nOne more, which the rest of the day expands on: <b>a job can run more than once.</b> A retry, a duplicate dispatch or a worker restart can all cause it, so `handle()` should be safe to repeat. That property is called idempotency, and it is the difference between a queue that works and one that sends the same invoice twice.",
      diagram: `The idea

  > Do not make the user wait for work that does not
    need to happen during the request.


  Without a queue:

    upload → process audio → waveform → transcript
           → notify → HTTP response

  Thirty seconds of spinner, and a PHP worker occupied
  for all of it. Ten uploads at once and the site is
  unresponsive for everybody.


  With a queue:

    upload → save, dispatch a job → HTTP response
                                    (immediately)

    Queue → Worker → process → waveform → transcript
                   → notify

  The request does the minimum that must be true before
  answering.

  The question is not "is this slow". It is:
    does the user need this FINISHED before they get
    a response?


A job

  ProcessPodcast · SendInvoice · ResizeImage
  SendWelcomeEmail · GenerateReport

  Two things:

    the data it needs
           +
    a handle() method

  php artisan make:job ProcessPodcast

  implements ShouldQueue    ← what makes it QUEUED

    dispatch()   put it in the queue
    handle()     do the work, later, elsewhere


The constructor is the wire

  ProcessPodcast::dispatch(\$podcast)

    application → dispatch() → queue → worker → handle()

  ⚠️  Everything in the constructor is SERIALISED,
      stored, and deserialised later, in a different
      process.

  Three consequences:

    Models are stored as an ID, not as data.
      Laravel re-fetches when the job runs — usually
      right, and a failure if the row was deleted.

    The job runs against the state at EXECUTION time.
      Dispatch, then edit the invoice, and the email
      contains the edit. Sometimes correct, sometimes
      a surprise. Know which you meant.

    Whatever you pass must be serialisable.
      Not a closure, a request or a file handle.
      Pass ids and simple values; look the rest up
      inside handle().


  And one the whole day expands on:

    A job can run MORE THAN ONCE.

  A retry, a duplicate dispatch or a worker restart can
  each cause it. handle() should be safe to repeat. That
  property is idempotency, and it is the difference
  between a queue that works and one that sends the same
  invoice twice.`,
      codeExample: {
        title: "A job, and what crosses the wire",
        code: `<?php
// php artisan make:job ProcessPodcast

namespace App\\Jobs;

use App\\Models\\Podcast;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Queue\\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    // Serialised at dispatch, deserialised in the worker.
    public function __construct(public Podcast $podcast) {}

    public function handle(): void
    {
        $this->podcast->process();
        $this->podcast->generateWaveform();
        $this->podcast->generateTranscript();

        $this->podcast->user->notify(new PodcastReady($this->podcast));
    }
}

// ShouldQueue is what makes it queued. Without it,
// dispatch() runs it immediately.


<?php
// ---------- The controller ----------

public function store(Request $request)
{
    $podcast = Podcast::create([
        'user_id' => $request->user()->id,
        'path'    => $request->file('audio')->store('podcasts', 's3'),
    ]);

    // The minimum that must be true before answering.
    ProcessPodcast::dispatch($podcast);

    return redirect()->route('podcasts.show', $podcast);
}

// The response goes out now. The thirty seconds of work
// happens in a worker.


<?php
// ---------- What can and cannot cross the wire ----------

// ✓ A model: stored as an id, re-fetched when the job runs.
new ProcessPodcast($podcast);

// ✓ Ids and simple values.
new GenerateReport($user->id, $from->toDateString(), $to->toDateString());

// ❌ Not serialisable.
new ProcessPodcast(fn () => $podcast->process());
new ProcessUpload($request);
new ProcessFile(fopen($path, 'r'));

// ❌ A whole collection is serialised in full, and may
//    be stale by the time it runs.
new NotifyUsers(User::all());

// ✓ Pass the ids, look them up in handle().
new NotifyUsers(User::pluck('id')->all());


<?php
// ---------- State at execution time, not dispatch time ----------

$invoice->update(['total' => 100]);

SendInvoice::dispatch($invoice);       // stored as an id

$invoice->update(['total' => 200]);    // a second later

// The email contains 200, because the job re-fetched the
// invoice when it ran. Sometimes correct. Always worth
// knowing which you meant.


<?php
// ---------- A job can run twice ----------

// ❌ Charged twice if this job is retried.
public function handle(): void
{
    $this->gateway->charge($this->invoice->total);

    $this->invoice->update(['status' => 'paid']);
}

// ✓ Safe to repeat.
public function handle(): void
{
    if ($this->invoice->status === 'paid') {
        return;
    }

    $this->gateway->charge(
        $this->invoice->total,
        idempotencyKey: $this->invoice->uuid,
    );

    $this->invoice->update(['status' => 'paid']);
}`,
      },
      keyTakeaways: [
        "<b>A queue exists so the user does not wait for work that need not finish during the request.</b>",
        "The question is not whether something is slow, but whether the response depends on it being done.",
        "<b>A job is the data it needs plus a `handle()` method</b>, and `ShouldQueue` is what makes it queued.",
        "<b>`dispatch()` puts the job in the queue; `handle()` does the work later, in a different process.</b>",
        "<b>Everything in the constructor is serialised and deserialised elsewhere</b>, which explains most job bugs.",
        "<b>Models are stored as an id and re-fetched</b>, so a deleted row makes the job fail.",
        "<b>A job runs against the state at execution time</b>, not the state at dispatch.",
        "Closures, requests and file handles cannot cross that boundary; pass ids and look things up inside.",
        "<b>A job can run more than once</b>, through a retry, a duplicate dispatch or a worker restart.",
        "<b>`handle()` should therefore be safe to repeat</b>, which is idempotency and the theme of the day.",
      ],
      commonMistakes: [
        "<b>Doing slow work in the request because it is \"only a few seconds\".</b> Ten concurrent uploads is a stalled site.",
        "<b>Passing a closure or a request into a job.</b> Neither can be serialised across the boundary.",
        "<b>Passing a whole collection.</b> It is serialised in full and is stale by the time the job runs.",
        "<b>Assuming the job sees the data as it was at dispatch.</b> The model is re-fetched when it runs.",
        "<b>Writing a `handle()` that cannot be repeated.</b> One retry and the customer is charged twice.",
      ],
      quiz: [
        {
          question: "What question decides whether work belongs in a queue?",
          options: [
            "Is it slow?",
            "Does the user need it finished before they get a response?",
            "Does it use the database?",
            "Is it called often?",
          ],
          correctIndex: 1,
          explanation: "The request does the minimum that must be true before answering.",
        },
        {
          question: "How is a model stored when passed to a job?",
          options: [
            "As a full serialised copy",
            "As an id, and re-fetched when the job runs",
            "As JSON",
            "It cannot be passed",
          ],
          correctIndex: 1,
          explanation: "Which is why a deleted row makes the job fail, and why it sees later edits.",
        },
        {
          question: "What makes a class a queued job?",
          options: [
            "The `Job` suffix",
            "Implementing `ShouldQueue`",
            "Being in `app/Jobs`",
            "Having a `handle()` method",
          ],
          correctIndex: 1,
          explanation: "Without it, `dispatch()` runs the work immediately.",
        },
        {
          question: "Why must `handle()` be safe to run twice?",
          options: [
            "Laravel always runs jobs twice",
            "A retry, a duplicate dispatch or a worker restart can each cause it",
            "For performance",
            "It does not need to be",
          ],
          correctIndex: 1,
          explanation: "That property is idempotency, and it is the theme of the day.",
        },
      ],
    },
    {
      id: "dispatch-variants-and-drivers",
      title: "Dispatch variants & queue drivers",
      durationMinutes: 12,
      explanation: "Three ways to dispatch, and where the pending jobs actually live.\n\n---\n\n### 1. Basic — the three dispatches\n\n```php\nProcessPodcast::dispatch($podcast);              // queued\nProcessPodcast::dispatchSync($podcast);          // now, in this process\nProcessPodcast::dispatchAfterResponse($podcast); // after the response\n```\n\n<b>`dispatchSync()` runs the job immediately</b>, in the current request, and returns when it is done. No worker involved.\n\nWhich is useful for a job that is genuinely synchronous, and in tests where you want the work to have happened by the assertion. <b>And it is a trap when used because the queue is not configured</b>: the code looks queued, reviews as queued, and blocks the request like it never was.\n\n<b>`dispatchAfterResponse()` sits between the two:</b>\n\n```text\nHTTP request\n    ↓\nLaravel\n    ↓\nsend the response      ← the user is done waiting\n    ↓\nrun the work\n```\n\nThe user is not waiting, and no worker is needed. But <b>the PHP process is still busy</b>, so it is holding a slot that cannot serve another request, and a failure has nowhere to be recorded.\n\n```text\ndispatchAfterResponse   small, quick, and losing it is survivable\na real queue            heavy work, retries, failure tracking\n```\n\nA thirty-second podcast job is not an after-response task.\n\n---\n\n### 2. Intermediate — drivers\n\n<b>A driver is where pending jobs are stored:</b>\n\n```text\nsync · database · redis · sqs · beanstalkd\n```\n\n<b>`sync` does not queue at all.</b> Dispatch runs the job immediately, which makes local development simple and hides every queue-related behaviour: no retries, no failures table, no concurrency. Code that works on `sync` and breaks on `redis` is a common first surprise.\n\n<b>`database` puts jobs in a table:</b>\n\n```text\nLaravel → jobs table → worker\n```\n\nSimple, inspectable with SQL, and no extra infrastructure. The cost is that every worker polls the database, so a busy queue adds real load to the thing your application also needs for everything else.\n\n<b>`redis` is the usual production answer:</b>\n\n```text\nLaravel → Redis → worker\n```\n\nFast, built for this, and the only driver Horizon supports. If you expect meaningful queue traffic, this is where you end up.\n\n<b>`sqs`</b> is Amazon's managed queue: no server to run, and worth it when you are already on AWS. It has its own constraints, notably a maximum message size and at-least-once delivery, which is the same idempotency point from the last lesson made formal.\n\n---\n\n### 3. Advanced — choosing, and one thing to know about each\n\n```text\nsync        local development, and tests that need it done\ndatabase    small applications, low volume, no extra services\nredis       anything with real queue traffic, and Horizon\nsqs         AWS, managed, no infrastructure to operate\n```\n\n<b>The important thing is to run the same driver in staging that you run in production.</b> Queue bugs are timing bugs, and `sync` in development means every one of them waits to appear until it matters.\n\nThree practical notes.\n\n<b>The database driver needs its tables.</b> `php artisan queue:table` and a migration, and the same for `failed_jobs` and `job_batches`. A driver switch that forgets those fails at the first dispatch.\n\n<b>Redis persistence is a decision.</b> Redis configured without persistence loses every pending job on restart, and \"where did the queue go\" is a question you only ask once.\n\n<b>And the driver is per connection, not global.</b> `config/queue.php` can define several, so a high-volume queue can use Redis while something rare uses the database. That is what the routing in a later lesson builds on.",
      diagram: `Three dispatches

  ProcessPodcast::dispatch(\$podcast)              queued
  ProcessPodcast::dispatchSync(\$podcast)          now, this process
  ProcessPodcast::dispatchAfterResponse(\$podcast) after the response

  dispatchSync
    runs immediately, in the request, no worker.
    Useful for genuinely synchronous work and in tests.

    ⚠️  A trap when used because the queue is not
        configured: the code LOOKS queued, REVIEWS as
        queued, and blocks the request like it never was.

  dispatchAfterResponse

    HTTP request → Laravel → send the response
                           → run the work

    The user is not waiting, and no worker is needed.
    But the PHP process is still busy — holding a slot
    that cannot serve another request — and a failure
    has nowhere to be recorded.

      after-response   small, quick, losing it survivable
      a real queue     heavy work, retries, failure tracking

    A thirty-second podcast job is not an after-response
    task.


Drivers: where pending jobs live

  sync · database · redis · sqs · beanstalkd

  sync       does not queue at all. Dispatch runs it.
             Simple locally, and hides every queue
             behaviour: no retries, no failures table,
             no concurrency. Works on sync, breaks on
             redis is a common first surprise.

  database   Laravel → jobs table → worker
             Simple, inspectable with SQL, no extra
             infrastructure. Every worker POLLS the
             database, so a busy queue loads the thing
             your application needs for everything else.

  redis      Laravel → Redis → worker
             Fast, built for this, and the only driver
             Horizon supports.

  sqs        Amazon's managed queue. No server to run.
             Max message size, and at-least-once
             delivery — the idempotency point from the
             last lesson, made formal.


Choosing

  sync        local development, tests that need it done
  database    small apps, low volume, no extra services
  redis       real queue traffic, and Horizon
  sqs         AWS, managed, nothing to operate

  ⚠️  Run the SAME driver in staging as in production.
      Queue bugs are timing bugs, and sync in
      development means every one waits until it matters.


Three practical notes

  The database driver needs its tables: queue:table,
  plus failed_jobs and job_batches. A driver switch
  that forgets them fails at the first dispatch.

  Redis persistence is a decision. Without it, a restart
  loses every pending job. "Where did the queue go" is
  a question you ask once.

  The driver is per CONNECTION, not global. config/queue
  can define several, so a high-volume queue uses Redis
  while something rare uses the database — which the
  routing lesson builds on.`,
      codeExample: {
        title: "Dispatching, and configuring where jobs live",
        code: `<?php

// ---------- The three dispatches ----------

// Queued: a worker picks it up.
ProcessPodcast::dispatch($podcast);

// Now, in this process. No worker.
ProcessPodcast::dispatchSync($podcast);

// After the response is sent, still in this process.
ProcessPodcast::dispatchAfterResponse($podcast);


// ---------- Where each belongs ----------

// ✓ Heavy, needs retries and a failure record.
ProcessPodcast::dispatch($podcast);

// ✓ Small, quick, and losing it is survivable.
RecordPageView::dispatchAfterResponse($request->path());

// ❌ Thirty seconds of work holding a PHP process that
//    cannot serve another request, with no failure record.
ProcessPodcast::dispatchAfterResponse($podcast);

// ❌ Used because the queue is not configured. The code
//    reads as queued and blocks the request.
ProcessPodcast::dispatchSync($podcast);


<?php
// ---------- Conditional dispatch ----------

ProcessPodcast::dispatchIf($podcast->needsProcessing(), $podcast);
ProcessPodcast::dispatchUnless($podcast->isProcessed(), $podcast);


<?php
// ---------- config/queue.php ----------

return [
    'default' => env('QUEUE_CONNECTION', 'database'),

    'connections' => [

        // Does not queue. Runs immediately.
        'sync' => ['driver' => 'sync'],

        // A table. Simple, inspectable, polls the database.
        'database' => [
            'driver' => 'database',
            'table'  => 'jobs',
            'retry_after' => 90,
        ],

        // The usual production answer, and the only one
        // Horizon supports.
        'redis' => [
            'driver'      => 'redis',
            'connection'  => 'default',
            'queue'       => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
        ],

        // Managed. Nothing to operate.
        'sqs' => [
            'driver' => 'sqs',
            'queue'  => env('SQS_QUEUE'),
        ],

    ],
];

// Several connections can coexist: a high-volume queue
// on Redis, something rare on the database.


<?php
// ---------- Choosing per dispatch ----------

ProcessPodcast::dispatch($podcast)->onConnection('redis');
GenerateReport::dispatch($user)->onQueue('reports');


# ---------- The tables the database driver needs ----------

php artisan queue:table
php artisan queue:failed-table
php artisan queue:batches-table
php artisan migrate

# A driver switch that forgets these fails at the first
# dispatch.


# ---------- And the rule worth following ----------

# .env, locally
QUEUE_CONNECTION=redis

# Not sync. Queue bugs are timing bugs, and sync hides
# every one of them until production.`,
      },
      keyTakeaways: [
        "<b>`dispatch()` queues, `dispatchSync()` runs immediately, and `dispatchAfterResponse()` runs after the response.</b>",
        "<b>`dispatchSync()` used because the queue is unconfigured is a trap</b>: the code reads as queued and blocks the request.",
        "<b>`dispatchAfterResponse()` frees the user but not the PHP process</b>, and offers no retries or failure record.",
        "It suits small, quick work whose loss is survivable, and not a thirty-second job.",
        "<b>A driver is where pending jobs are stored</b>: `sync`, `database`, `redis`, `sqs`.",
        "<b>`sync` does not queue at all</b>, hiding retries, failures and concurrency until production.",
        "<b>`database` is simple and inspectable</b>, at the cost of every worker polling your main database.",
        "<b>`redis` is the usual production choice</b>, and the only driver Horizon supports.",
        "<b>Run the same driver in staging as in production</b>, because queue bugs are timing bugs.",
        "The database driver needs its tables, Redis needs persistence configured, and drivers are per connection.",
      ],
      commonMistakes: [
        "<b>Using `dispatchSync()` to work around a broken queue.</b> The request blocks and the code hides it.",
        "<b>Putting heavy work in `dispatchAfterResponse()`.</b> The PHP process stays busy and failures vanish.",
        "<b>Developing on `sync` and deploying on `redis`.</b> Every timing bug appears for the first time in production.",
        "<b>Switching to the database driver without running the migrations.</b> The first dispatch fails.",
        "<b>Running Redis without persistence.</b> A restart empties the queue with no record of what was in it.",
      ],
      quiz: [
        {
          question: "What does `dispatchAfterResponse()` free up?",
          options: [
            "The PHP process",
            "The user's wait, but not the PHP process",
            "Both",
            "Neither",
          ],
          correctIndex: 1,
          explanation: "The process stays busy, and a failure has nowhere to be recorded.",
        },
        {
          question: "What does the `sync` driver do?",
          options: [
            "Queues jobs and runs them in order",
            "Runs the job immediately, so no queue behaviour exists",
            "Stores jobs in the database",
            "Runs jobs after the response",
          ],
          correctIndex: 1,
          explanation: "Which hides retries, failures and concurrency until production.",
        },
        {
          question: "What is the cost of the database queue driver?",
          options: [
            "It cannot retry",
            "Every worker polls your main database, adding load to what the application also needs",
            "It loses jobs on restart",
            "It has a message size limit",
          ],
          correctIndex: 1,
          explanation: "Simple and inspectable, at that price.",
        },
        {
          question: "Why run the same queue driver locally as in production?",
          options: [
            "For speed",
            "Queue bugs are timing bugs, and `sync` hides all of them until it matters",
            "Laravel requires it",
            "To use Horizon",
          ],
          correctIndex: 1,
          explanation: "Code that works on `sync` and breaks on `redis` is a common first surprise.",
        },
      ],
    },
    {
      id: "workers",
      title: "Workers, queue:work & delayed dispatch",
      durationMinutes: 11,
      explanation: "Dispatching puts a job somewhere. Something has to come and get it.\n\n---\n\n### 1. Basic — what a worker does\n\n```text\nWorker\n  ↓\nget a job\n  ↓\nrun it\n  ↓\nget the next job\n  ↓\n...\n```\n\n```bash\nphp artisan queue:work\n```\n\n<b>It is a long-running process</b>, which is the whole difference from everything else in Laravel. A web request boots the framework, answers, and exits. A worker boots once and then loops, potentially for days.\n\nThat single fact causes most worker confusion:\n\n<b>Code changes do not take effect.</b> The worker booted with the old code and is still running it. Deploying without restarting workers means new jobs running old logic, which produces bugs that make no sense against the code in front of you.\n\n```bash\nphp artisan queue:restart\n```\n\ntells workers to finish the current job and exit, so the process manager starts them fresh. <b>That command belongs in every deploy script.</b>\n\n<b>And memory accumulates.</b> A process alive for days holds whatever leaks, which is why workers are given limits and restarted regularly rather than trusted to run forever.\n\n---\n\n### 2. Intermediate — `work` versus `listen`\n\n```bash\nphp artisan queue:listen\n```\n\nreboots the framework for every job:\n\n```text\nboot Laravel → job → reload → job → reload → ...\n```\n\nSo code changes apply immediately, and every job pays the boot cost.\n\n```text\nqueue:work      boots once, fast, needs a restart to pick up changes\nqueue:listen    boots per job, slow, always current\n```\n\n<b>`work` in production, `listen` occasionally while developing</b> if restarting is annoying you. Most people use `work` everywhere and get used to `queue:restart`.\n\nThe options worth knowing:\n\n```text\n--queue=high,default    process these queues, in this order\n--tries=3               attempts before failing\n--timeout=60            seconds before killing a job\n--max-jobs=1000         exit after this many\n--max-time=3600         exit after this long\n--sleep=3               seconds to wait when the queue is empty\n--stop-when-empty       exit when there is nothing left\n```\n\n<b>`--max-jobs` and `--max-time` are the memory answer:</b> exit deliberately, and let the process manager start a fresh one.\n\n---\n\n### 3. Advanced — delay, and what \"later\" means\n\n```php\nProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));\n```\n\n```text\ndispatch → waiting → 10 minutes → a worker runs it\n```\n\nUseful for:\n\n```text\nreminders · scheduled notifications\nfollow-ups · delayed cleanup\n```\n\nAnd a useful pattern with it: <b>a delay is how you wait for something you cannot control.</b> A webhook that says a file is being processed, checked again in thirty seconds, is a delayed job re-dispatching itself until the answer arrives.\n\nThree things about delays that surprise people.\n\n<b>The delay is a minimum, not a promise.</b> The job becomes available at that time; a busy queue runs it later. If the exact time matters, a delay is the wrong tool and the scheduler is the right one.\n\n<b>SQS caps delays at fifteen minutes.</b> Longer delays on that driver silently need a different approach.\n\n<b>And a delayed job still holds its data.</b> Dispatching ten thousand jobs delayed by a day means ten thousand rows sitting in your queue for a day, which is fine on Redis and noticeable on a database driver.\n\nOne last practical note: <b>a worker only processes the queues you tell it to.</b> A job dispatched to `reports` with no worker listening to `reports` sits there forever, and looks exactly like a job that is broken. The first thing to check when a job never runs is whether anything is watching that queue.",
      diagram: `What a worker does

    Worker → get a job → run it → get the next → ...

    php artisan queue:work

  It is a LONG-RUNNING process, which is the whole
  difference. A web request boots, answers and exits.
  A worker boots once and loops, potentially for days.

  Which causes most worker confusion:

    ⚠️  Code changes do not take effect.
        The worker booted with the old code and is still
        running it. Deploying without restarting workers
        means new jobs running old logic — bugs that make
        no sense against the code in front of you.

        php artisan queue:restart

        finishes the current job and exits, so the
        process manager starts them fresh.
        This belongs in every deploy script.

    ⚠️  Memory accumulates.
        A process alive for days holds whatever leaks,
        which is why workers get limits rather than
        being trusted to run forever.


work versus listen

  queue:listen reboots the framework per job:

    boot → job → reload → job → reload → ...

    queue:work     boots once, fast, needs a restart
                   to pick up changes
    queue:listen   boots per job, slow, always current

  work in production. listen occasionally while
  developing. Most people use work everywhere and get
  used to queue:restart.


  Options worth knowing:

    --queue=high,default   these queues, in this order
    --tries=3              attempts before failing
    --timeout=60           seconds before killing a job
    --max-jobs=1000        exit after this many
    --max-time=3600        exit after this long
    --sleep=3              wait when the queue is empty
    --stop-when-empty      exit when nothing is left

  --max-jobs and --max-time are the memory answer: exit
  deliberately, and let the process manager start a
  fresh one.


Delay

    ->delay(now()->addMinutes(10))

    dispatch → waiting → 10 minutes → a worker runs it

  reminders · scheduled notifications
  follow-ups · delayed cleanup

  And: a delay is how you wait for something you cannot
  control. A job that checks again in thirty seconds,
  re-dispatching itself until the answer arrives.


  Three surprises:

    The delay is a MINIMUM, not a promise. A busy queue
    runs it later. If the exact time matters, the
    scheduler is the right tool.

    SQS caps delays at fifteen minutes.

    A delayed job still holds its data. Ten thousand
    jobs delayed by a day is ten thousand rows sitting
    there for a day — fine on Redis, noticeable on a
    database driver.


  ⚠️  A worker only processes the queues you tell it to.
      A job on 'reports' with nothing listening to
      'reports' sits there forever, and looks exactly
      like a broken job.

      First thing to check when a job never runs.`,
      codeExample: {
        title: "Running workers, and delaying work",
        code: `# ---------- The worker ----------

php artisan queue:work

# Long-running. Boots once, then loops.


# Options that matter in production:

php artisan queue:work redis \\
    --queue=high,default,low \\
    --tries=3 \\
    --timeout=60 \\
    --max-jobs=1000 \\
    --max-time=3600 \\
    --sleep=3

# --queue     processed in that order: high first
# --max-jobs  exit after 1000, and let the process
# --max-time  manager start a fresh process. This is
#             the answer to a long-lived process
#             accumulating memory.


# ---------- After every deploy ----------

php artisan queue:restart

# Workers finish the current job and exit. Without this,
# they keep running the code they booted with, and new
# jobs execute old logic.


# ---------- While developing ----------

php artisan queue:listen

# Reboots per job, so code changes apply immediately.
# Slower, and fine locally.

php artisan queue:work --stop-when-empty
# Useful in a test or a one-off script.


<?php
// ---------- Delay ----------

ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));

SendReminder::dispatch($invoice)->delay(
    $invoice->due_at->subDays(3)
);

// A job that waits for something outside your control,
// by re-dispatching itself:
class CheckTranscodingStatus implements ShouldQueue
{
    public function __construct(public Video $video, public int $attempt = 1) {}

    public function handle(): void
    {
        $status = $this->transcoder->status($this->video->external_id);

        if ($status === 'processing' && $this->attempt < 20) {
            self::dispatch($this->video, $this->attempt + 1)
                ->delay(now()->addSeconds(30));

            return;
        }

        $this->video->update(['status' => $status]);
    }
}


<?php
// ---------- Delay is a minimum, not a promise ----------

// Available in 10 minutes. Run in 10 minutes, or later,
// depending on how busy the queue is.
SendReminder::dispatch($invoice)->delay(now()->addMinutes(10));

// If the exact time matters, this is the scheduler's job:
// routes/console.php
Schedule::command('invoices:remind')->dailyAt('09:00');


<?php
// ---------- Choosing a queue ----------

GenerateReport::dispatch($user)->onQueue('reports');

// ⚠️ And something must be listening to it:
//    php artisan queue:work --queue=high,default,reports
//
// A job on a queue no worker watches sits there forever,
// and looks exactly like a broken job. First thing to
// check when a job never runs.`,
      },
      keyTakeaways: [
        "<b>A worker is a long-running process</b> that loops over jobs, unlike a request that boots, answers and exits.",
        "<b>A worker keeps running the code it booted with</b>, so a deploy without a restart runs old logic.",
        "<b>`php artisan queue:restart` belongs in every deploy script.</b>",
        "<b>Long-lived processes accumulate memory</b>, which `--max-jobs` and `--max-time` address by exiting deliberately.",
        "<b>`queue:work` boots once and is fast; `queue:listen` reboots per job and is always current.</b>",
        "Use `work` in production, and `listen` locally if restarting becomes annoying.",
        "`--queue=high,default` sets the order queues are drained in, and `--timeout` kills a job that hangs.",
        "<b>`->delay()` makes a job available later</b>, which suits reminders, follow-ups and delayed cleanup.",
        "<b>A delay is a minimum, not a promise</b>; when the exact time matters, use the scheduler.",
        "<b>A worker only processes the queues it is told to</b>, so a job on an unwatched queue waits forever.",
      ],
      commonMistakes: [
        "<b>Deploying without `queue:restart`.</b> Workers run the old code and produce bugs that match no source you can see.",
        "<b>Running a worker with no memory or job limit.</b> It grows until something kills it at an inconvenient moment.",
        "<b>Using `queue:listen` in production.</b> Every job pays a full framework boot.",
        "<b>Dispatching to a named queue nothing is listening to.</b> The job waits forever and looks broken.",
        "<b>Relying on `->delay()` for an exact time.</b> It is the earliest the job may run, not when it will.",
      ],
      quiz: [
        {
          question: "Why does a code change not affect a running worker?",
          options: [
            "The cache needs clearing",
            "The worker is a long-running process still executing the code it booted with",
            "Jobs are compiled",
            "It does affect it",
          ],
          correctIndex: 1,
          explanation: "`queue:restart` is what makes workers pick up new code.",
        },
        {
          question: "What is the difference between `queue:work` and `queue:listen`?",
          options: [
            "None",
            "`work` boots once and is fast; `listen` reboots per job and always has current code",
            "`listen` is for Redis only",
            "`work` cannot retry",
          ],
          correctIndex: 1,
          explanation: "`work` in production, and a restart after each deploy.",
        },
        {
          question: "Why give a worker `--max-jobs` or `--max-time`?",
          options: [
            "To limit database load",
            "So it exits deliberately and a fresh process starts, rather than accumulating memory for days",
            "To retry failed jobs",
            "To prioritise queues",
          ],
          correctIndex: 1,
          explanation: "A long-lived process holds whatever leaks.",
        },
        {
          question: "A job never runs. What is the first thing to check?",
          options: [
            "The database connection",
            "Whether any worker is listening to the queue it was dispatched to",
            "The job's constructor",
            "The cache driver",
          ],
          correctIndex: 1,
          explanation: "A job on an unwatched queue waits forever and looks broken.",
        },
      ],
    },
    {
      id: "chains-and-batches",
      title: "Chains & batches",
      durationMinutes: 12,
      explanation: "One job is easy. The interesting problems start when there are many.\n\n---\n\n### 1. Basic — chains, for order\n\nSome work has to happen in sequence:\n\n```text\nDownloadPodcast\n      ↓\nProcessPodcast\n      ↓\nGenerateTranscript\n      ↓\nNotifyUser\n```\n\n<b>A <i>chain</i></b> runs jobs one after another, each starting only when the last succeeded:\n\n```php\nBus::chain([\n    new DownloadPodcast($podcast),\n    new ProcessPodcast($podcast),\n    new GenerateTranscript($podcast),\n    new NotifyUser($podcast),\n])->dispatch();\n```\n\n```text\nA → success → B → success → C → success → D\n```\n\n<b>If one fails, the chain stops.</b> Nothing after it runs, which is exactly right: transcribing a podcast that was never processed produces nothing useful.\n\n`->catch()` gives you somewhere to react when it breaks.\n\n---\n\n### 2. Intermediate — batches, for volume\n\nA hundred podcasts to process is a different shape: they do not depend on each other, and you want them all done.\n\n```text\nChain                 Batch\n─────                 ─────\nA → B → C → D                ┌→ A\n                             ├→ B\norder matters        Batch ──┼→ C\none failure stops            ├→ D\n  the rest                   └→ E\n\n                     independent, and\n                     parallel across workers\n```\n\n```php\nBus::batch($jobs)->dispatch();\n```\n\n<b>Laravel tracks the batch as a whole:</b>\n\n```text\ntotal jobs · pending · failed · processed · progress\n```\n\nWhich is what a batch is really for. Dispatching a hundred jobs individually gives you a hundred unrelated jobs; a batch gives you one thing to ask \"is it done?\" about, and a progress bar you can show somebody.\n\nAnd because the jobs are independent, <b>four workers process the batch four times faster.</b> A chain cannot do that, by definition.\n\n---\n\n### 3. Advanced — callbacks, and choosing\n\nA batch has lifecycle hooks:\n\n```php\nBus::batch($jobs)\n    ->before(fn (Batch $batch) => ...)   // created, not yet running\n    ->progress(fn (Batch $batch) => ...) // after each job\n    ->then(fn (Batch $batch) => ...)     // all succeeded\n    ->catch(fn (Batch $batch, $e) => ...)// the first failure\n    ->finally(fn (Batch $batch) => ...)  // finished either way\n    ->dispatch();\n```\n\n<b>`then()` is the one that makes batches worth using</b>: \"when all hundred are done, generate the summary and email it\". Without it, that is a polling loop you write yourself.\n\nTwo behaviours to know.\n\n<b>By default one failure cancels the batch.</b> Remaining jobs are not run. `->allowFailures()` changes that, and it is usually what you want for something like a bulk import where one bad row should not stop the other ninety-nine.\n\n<b>And callbacks are serialised too</b>, so `$this` is not available inside them. That is the same wire from lesson one: pass what the callback needs, or reference a static.\n\nThe two can combine, and that is often the real shape:\n\n```php\nBus::batch([\n    [new DownloadPodcast($a), new ProcessPodcast($a)],\n    [new DownloadPodcast($b), new ProcessPodcast($b)],\n])->dispatch();\n```\n\nA batch of chains: each podcast's steps in order, and the podcasts in parallel.\n\nWhich makes the choice a question about the work rather than the API:\n\n```text\ndoes step two need step one's result?     →  a chain\nare they independent, and you want to\n  know when they are all done?            →  a batch\nboth, at different levels?                →  a batch of chains\n```",
      diagram: `Chains, for order

    DownloadPodcast → ProcessPodcast
                    → GenerateTranscript → NotifyUser

    Bus::chain([...])->dispatch()

    A → success → B → success → C → success → D

  If one fails, the chain STOPS. Nothing after it runs,
  which is right: transcribing a podcast that was never
  processed produces nothing.

  ->catch() gives you somewhere to react.


Batches, for volume

  Chain                  Batch
  ─────                  ─────
  A → B → C → D                 ┌→ A
                                ├→ B
  order matters         Batch ──┼→ C
  one failure stops             ├→ D
    the rest                    └→ E

                        independent, and parallel
                        across workers

    Bus::batch(\$jobs)->dispatch()

  Laravel tracks it as a whole:

    total · pending · failed · processed · progress

  Which is the point. A hundred individual dispatches is
  a hundred unrelated jobs. A batch is ONE thing to ask
  "is it done?" about, and a progress bar you can show.

  And because the jobs are independent, four workers
  process a batch four times faster. A chain cannot,
  by definition.


Callbacks

    ->before()    created, not yet running
    ->progress()  after each job
    ->then()      all succeeded
    ->catch()     the first failure
    ->finally()   finished either way

  then() is what makes batches worth using: "when all
  hundred are done, generate the summary and email it".
  Without it, that is a polling loop you write yourself.

  Two behaviours:

    By default ONE FAILURE CANCELS the batch. Remaining
    jobs do not run. ->allowFailures() changes that, and
    is usually right for a bulk import where one bad row
    should not stop the other ninety-nine.

    Callbacks are SERIALISED too, so \$this is not
    available inside them. Same wire as lesson one.


They combine

    Bus::batch([
        [new DownloadPodcast(\$a), new ProcessPodcast(\$a)],
        [new DownloadPodcast(\$b), new ProcessPodcast(\$b)],
    ])->dispatch();

  A batch of chains: each podcast's steps in order, and
  the podcasts in parallel.


  Which makes it a question about the WORK:

    does step two need step one's result?   →  a chain
    independent, and you want to know when
      they are all done?                    →  a batch
    both, at different levels?              →  a batch
                                               of chains`,
      codeExample: {
        title: "Ordered work, and a lot of work",
        code: `<?php

use Illuminate\\Bus\\Batch;
use Illuminate\\Support\\Facades\\Bus;
use Throwable;

// ---------- A chain: order matters ----------

Bus::chain([
    new DownloadPodcast($podcast),
    new ProcessPodcast($podcast),
    new GenerateTranscript($podcast),
    new NotifyUser($podcast),
])->catch(function (Throwable $e) use ($podcast) {
    $podcast->update(['status' => 'failed']);
})->dispatch();

// Each step starts only when the last succeeded. If
// ProcessPodcast fails, the transcript is never attempted,
// which is correct: it would have nothing to transcribe.

// From inside a job, to continue the chain:
$this->chain([new GenerateTranscript($this->podcast)]);


<?php
// ---------- A batch: many independent jobs ----------

$jobs = Podcast::where('status', 'pending')
    ->pluck('id')
    ->map(fn ($id) => new ProcessPodcast($id))
    ->all();

$batch = Bus::batch($jobs)
    ->name('Process pending podcasts')

    // One failure should not stop the other ninety-nine.
    ->allowFailures()

    ->progress(function (Batch $batch) {
        // After each job. Useful for a progress bar.
        Cache::put("batch:{$batch->id}:progress", $batch->progress());
    })

    ->then(function (Batch $batch) {
        // All of them succeeded. This is what a batch
        // is for: one place to react when it is done.
        Notification::route('mail', 'ops@example.com')
            ->notify(new BatchFinished($batch->id));
    })

    ->catch(function (Batch $batch, Throwable $e) {
        Log::error('Batch failed', ['batch' => $batch->id]);
    })

    ->finally(function (Batch $batch) {
        Cache::forget("batch:{$batch->id}:progress");
    })

    ->dispatch();

// One thing to ask about:
$batch->id;
$batch->totalJobs;
$batch->pendingJobs;
$batch->failedJobs;
$batch->progress();      // a percentage
$batch->finished();


<?php
// ---------- Checking on it later ----------

$batch = Bus::findBatch($batchId);

return [
    'progress' => $batch->progress(),
    'pending'  => $batch->pendingJobs,
    'failed'   => $batch->failedJobs,
];

$batch->cancel();     // stop the remaining jobs


<?php
// ---------- A batch of chains ----------

// Each podcast's steps in order; the podcasts in parallel.
Bus::batch(
    $podcasts->map(fn ($podcast) => [
        new DownloadPodcast($podcast),
        new ProcessPodcast($podcast),
        new GenerateTranscript($podcast),
    ])->all()
)->dispatch();


<?php
// ---------- Callbacks are serialised too ----------

// ❌ $this is not available inside the callback.
Bus::batch($jobs)->then(function (Batch $batch) {
    $this->notify();
})->dispatch();

// ✓ Pass what it needs.
$userId = $request->user()->id;

Bus::batch($jobs)->then(function (Batch $batch) use ($userId) {
    User::find($userId)->notify(new BatchFinished($batch->id));
})->dispatch();


<?php
// ---------- Making the job batch-aware ----------

class ProcessPodcast implements ShouldQueue
{
    use Batchable, Queueable;

    public function handle(): void
    {
        // Stop early if the batch was cancelled.
        if ($this->batch()?->cancelled()) {
            return;
        }

        // ...
    }
}`,
      },
      keyTakeaways: [
        "<b>A chain runs jobs in sequence</b>, each starting only when the previous one succeeded.",
        "<b>A failure stops the chain</b>, which is correct when later steps depend on earlier ones.",
        "<b>A batch runs independent jobs and tracks them as one unit</b>: total, pending, failed, progress.",
        "That tracking is the point: a hundred dispatches is a hundred unrelated jobs, a batch is one thing to ask about.",
        "<b>Batched jobs run in parallel across workers</b>, which a chain cannot do by definition.",
        "<b>`then()` runs when every job succeeded</b>, which replaces a polling loop you would otherwise write.",
        "`before()`, `progress()`, `catch()` and `finally()` cover the rest of the lifecycle.",
        "<b>One failure cancels a batch by default</b>, and `allowFailures()` is usually right for a bulk import.",
        "<b>Batch callbacks are serialised</b>, so `$this` is unavailable and values must be passed in.",
        "<b>A batch of chains does both</b>: ordered steps per item, items in parallel.",
      ],
      commonMistakes: [
        "<b>Using a batch where order matters.</b> The jobs run in parallel and the second may finish first.",
        "<b>Using a chain for a hundred independent jobs.</b> They run one at a time, however many workers you have.",
        "<b>Forgetting `allowFailures()` on an import.</b> One bad row cancels the remaining ninety-nine.",
        "<b>Referring to `$this` in a batch callback.</b> It is serialised separately and has no instance.",
        "<b>Polling to find out when a batch is done.</b> `then()` exists for exactly that.",
      ],
      quiz: [
        {
          question: "What happens when a job in a chain fails?",
          options: [
            "The chain continues",
            "The chain stops, and nothing after it runs",
            "The chain restarts",
            "Only that job is retried",
          ],
          correctIndex: 1,
          explanation: "Which is correct when later steps depend on earlier ones.",
        },
        {
          question: "What does a batch give you that a hundred individual dispatches do not?",
          options: [
            "Faster execution",
            "One unit to track: total, pending, failed and progress, and a `then()` when all are done",
            "Automatic retries",
            "Ordering",
          ],
          correctIndex: 1,
          explanation: "Otherwise, knowing when everything finished is a polling loop.",
        },
        {
          question: "What does `allowFailures()` change?",
          options: [
            "Failed jobs are retried",
            "One failure no longer cancels the remaining jobs in the batch",
            "Failures are not recorded",
            "The batch never completes",
          ],
          correctIndex: 1,
          explanation: "Usually what a bulk import wants.",
        },
        {
          question: "Why is `$this` unavailable inside a batch callback?",
          options: [
            "It is a static context",
            "The callback is serialised and stored separately, like the jobs themselves",
            "Laravel forbids it",
            "It is available",
          ],
          correctIndex: 1,
          explanation: "Pass in what it needs with `use`.",
        },
      ],
    },
    {
      id: "routing-and-attributes",
      title: "Queue routing & job attributes",
      durationMinutes: 10,
      explanation: "Two Laravel 13 additions that move configuration to where it belongs.\n\n---\n\n### 1. Basic — separating queues\n\nOne queue with everything in it has a problem you meet the first busy day:\n\n```text\n10,000 podcast jobs\n        +\n1 password reset email\n        ↓\nthe email is behind ten thousand podcasts\n```\n\nThe fix is separate queues:\n\n```text\nredis\n ├── podcasts\n ├── emails\n ├── reports\n └── imports\n```\n\nand workers that specialise. Two workers on `emails` are never blocked by the import queue, whatever is in it.\n\n<b>Laravel 13's queue routing declares where a job goes, once:</b>\n\n```php\nQueue::route(ProcessPodcast::class, connection: 'redis', queue: 'podcasts');\n```\n\n```text\nProcessPodcast\n      ├── connection → redis\n      └── queue      → podcasts\n```\n\nWhich is a real improvement over the alternatives. Setting `$queue` inside every job scatters routing across your job classes; calling `->onQueue('podcasts')` at each dispatch site means one caller eventually forgets. <b>One file that says where every kind of work goes is something you can read and audit.</b>\n\n---\n\n### 2. Intermediate — attributes\n\nJob configuration used to be properties:\n\n```php\npublic $tries = 3;\npublic $backoff = 10;\npublic $timeout = 120;\n```\n\nLaravel 13 expresses it as attributes on the class:\n\n```php\n#[Tries(3)]\n#[Backoff(10)]\n#[Timeout(120)]\nclass ProcessPodcast implements ShouldQueue\n{\n}\n```\n\n```text\n#[Tries]     maximum attempts\n#[Backoff]   delay between attempts\n#[Timeout]   maximum execution time\n```\n\nAnd `#[FailOnTimeout]`, which says a timeout should fail the job rather than be treated as something to retry.\n\n<b>The gain is that the configuration is visible above the class</b>, next to its name, rather than mixed in with its properties. Reading `ProcessPodcast`, you see how it behaves before you see what it does.\n\nThe properties still work, and you will see both. The next lesson is about choosing the values.\n\n---\n\n### 3. Advanced — priorities in practice\n\nSeparate queues are only useful if workers respect the difference:\n\n```php\nphp artisan queue:work --queue=high,default,low\n```\n\n<b>The order is a priority order</b>: the worker drains `high` completely before looking at `default`. Which is the behaviour you want, and also the failure mode to know about: <b>a permanently busy `high` queue starves everything below it.</b>\n\nThe usual split:\n\n```text\nhigh      payments · password resets · anything a\n          person is waiting for\n\ndefault   email · notifications · normal work\n\nlow       analytics · cleanup · reports · imports\n```\n\n<b>The question that sorts a job is not how important the work is</b>, it is who is waiting. A password reset email is trivial work that somebody is staring at an inbox for. A monthly report is important work nobody is watching.\n\nTwo practical notes.\n\n<b>Dedicated workers beat priorities for anything that must not be delayed.</b> One worker on `--queue=high` alone can never be blocked by anything else, where a shared worker with a priority list can be busy with a long job when the urgent one arrives.\n\n<b>And connection matters as much as queue.</b> Routing a rare, slow job to the database connection while everything else uses Redis keeps ten thousand rows out of your fast path, and is exactly what per-job routing makes easy to express.",
      diagram: `Separating queues

  One queue with everything in it:

    10,000 podcast jobs
            +
    1 password reset email
            ↓
    the email is behind ten thousand podcasts

  Separate them:

    redis
     ├── podcasts
     ├── emails
     ├── reports
     └── imports

  and workers specialise. Two workers on emails are
  never blocked by the import queue.


  Laravel 13 declares routing once:

    Queue::route(ProcessPodcast::class,
        connection: 'redis', queue: 'podcasts');

      ProcessPodcast
            ├── connection → redis
            └── queue      → podcasts

  Better than the alternatives: \$queue inside every job
  scatters routing across your job classes, and
  ->onQueue() at each dispatch site means one caller
  eventually forgets.

  One file saying where every kind of work goes is
  something you can read and audit.


Attributes

  Before:                    Laravel 13:

    public \$tries = 3;         #[Tries(3)]
    public \$backoff = 10;      #[Backoff(10)]
    public \$timeout = 120;     #[Timeout(120)]

    #[Tries]     maximum attempts
    #[Backoff]   delay between attempts
    #[Timeout]   maximum execution time
    #[FailOnTimeout]  a timeout FAILS the job rather
                      than being retried

  The configuration sits above the class, next to its
  name, rather than mixed in with its properties.
  Reading the job, you see how it BEHAVES before you
  see what it does.


Priorities in practice

    queue:work --queue=high,default,low

  The order is a PRIORITY order: high is drained
  completely before default is looked at.

  ⚠️  Which is also the failure mode: a permanently busy
      high queue starves everything below it.

  The usual split:

    high      payments · password resets · anything a
              person is waiting for
    default   email · notifications · normal work
    low       analytics · cleanup · reports · imports

  And the sorting question is not how IMPORTANT the work
  is. It is WHO IS WAITING.

    a password reset   trivial work, somebody staring
                       at an inbox
    a monthly report   important work nobody is watching


  Two notes:

    Dedicated workers beat priorities for anything that
    must not be delayed. A worker on --queue=high alone
    can never be blocked; a shared worker with a priority
    list can be mid-way through a long job.

    Connection matters as much as queue. Routing a rare,
    slow job to the database while everything else uses
    Redis keeps ten thousand rows out of your fast path.`,
      codeExample: {
        title: "Routing jobs, and declaring their behaviour",
        code: `<?php
// ---------- Routing, in one place ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Support\\Facades\\Queue;

public function boot(): void
{
    // Heavy, and nobody is waiting.
    Queue::route(ProcessPodcast::class, connection: 'redis', queue: 'podcasts');
    Queue::route(ImportCustomers::class, connection: 'redis', queue: 'imports');

    // Somebody is staring at an inbox.
    Queue::route(SendPasswordReset::class, connection: 'redis', queue: 'high');
    Queue::route(ChargeCard::class, connection: 'redis', queue: 'high');

    // Rare and slow: keep it off the fast path entirely.
    Queue::route(GenerateAnnualReport::class, connection: 'database', queue: 'reports');
}

// One file that says where every kind of work goes.
// The alternatives scatter it across job classes or
// across dispatch sites, and one of those eventually
// forgets.


<?php
// ---------- Attributes ----------

namespace App\\Jobs;

use Illuminate\\Queue\\Attributes\\Backoff;
use Illuminate\\Queue\\Attributes\\FailOnTimeout;
use Illuminate\\Queue\\Attributes\\Timeout;
use Illuminate\\Queue\\Attributes\\Tries;

#[Tries(3)]
#[Backoff(10)]
#[Timeout(120)]
class ProcessPodcast implements ShouldQueue
{
    public function handle(): void
    {
        // ...
    }
}

// A job talking to a flaky API: more attempts, growing
// delay, and a timeout means give up rather than retry.
#[Tries(5)]
#[Backoff([10, 30, 60, 120])]
#[Timeout(30)]
#[FailOnTimeout]
class SyncWithProvider implements ShouldQueue
{
}


<?php
// ---------- The older form, which still works ----------

class ProcessPodcast implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 10;
    public int $timeout = 120;
}

// You will see both. The attributes put the behaviour
// above the class, where it reads before the code does.


# ---------- Workers that respect the split ----------

# A priority order: high is drained before default.
php artisan queue:work redis --queue=high,default,low

# A dedicated worker for anything that must not wait.
# It cannot be blocked by a long job on another queue.
php artisan queue:work redis --queue=high

# The heavy queue, with more workers and a longer timeout.
php artisan queue:work redis --queue=podcasts --timeout=300


<?php
// ---------- Per-dispatch, when it is genuinely one-off ----------

GenerateReport::dispatch($user)->onQueue('reports');

ProcessPodcast::dispatch($podcast)
    ->onConnection('redis')
    ->onQueue('podcasts');

// Fine for an exception. As the default mechanism, it
// puts routing in every caller.`,
      },
      keyTakeaways: [
        "<b>One queue for everything means urgent work waits behind bulk work.</b>",
        "<b>Separate queues let workers specialise</b>, so an email queue is never blocked by an import.",
        "<b>`Queue::route()` declares a job's connection and queue in one place</b>, rather than in every job or every caller.",
        "Setting `$queue` per job scatters routing; setting it per dispatch means a caller eventually forgets.",
        "<b>`#[Tries]`, `#[Backoff]`, `#[Timeout]` and `#[FailOnTimeout]` put job behaviour above the class.</b>",
        "The equivalent properties still work, and you will see both forms.",
        "<b>`--queue=high,default,low` is a priority order</b>, draining each queue before the next.",
        "<b>A permanently busy high queue starves the ones below it</b>, which is the failure mode of priorities.",
        "<b>What sorts a job is who is waiting, not how important the work is.</b>",
        "<b>A dedicated worker beats a priority list</b> for anything that must never be delayed.",
      ],
      commonMistakes: [
        "<b>Putting every job on one queue.</b> A password reset waits behind ten thousand imports.",
        "<b>Routing at each dispatch site.</b> One caller forgets, and that job lands on the default queue.",
        "<b>Sorting queues by importance rather than by who is waiting.</b> A monthly report is important and nobody is watching.",
        "<b>Relying on a priority list for urgent work.</b> The worker may be mid-way through a long job when it arrives.",
        "<b>Creating queues nothing is listening to.</b> The job waits forever, exactly as in the last lesson.",
      ],
      quiz: [
        {
          question: "What problem do separate queues solve?",
          options: [
            "Slow jobs",
            "Urgent work waiting behind bulk work on a single shared queue",
            "Failed jobs",
            "Memory use",
          ],
          correctIndex: 1,
          explanation: "Workers can then specialise per queue.",
        },
        {
          question: "What does `Queue::route()` improve on?",
          options: [
            "Dispatch performance",
            "Routing scattered across job classes or across every dispatch site",
            "Retry behaviour",
            "Failure handling",
          ],
          correctIndex: 1,
          explanation: "One file you can read and audit.",
        },
        {
          question: "What does `--queue=high,default,low` mean?",
          options: [
            "Three separate workers",
            "A priority order: `high` is drained before `default` is looked at",
            "Round-robin between them",
            "Only `high` is processed",
          ],
          correctIndex: 1,
          explanation: "Which also means a busy `high` queue can starve the rest.",
        },
        {
          question: "What decides which queue a job belongs on?",
          options: [
            "How long it takes",
            "Who is waiting for it",
            "How often it runs",
            "Which model it touches",
          ],
          correctIndex: 1,
          explanation: "A password reset is trivial work somebody is watching; a report is not.",
        },
      ],
    },
    {
      id: "retries-backoff-timeouts",
      title: "Retries, backoff, timeouts & permanent failures",
      durationMinutes: 12,
      explanation: "A job that always works needs none of this. Everything here is about the other kind.\n\n---\n\n### 1. Basic — retries\n\n```text\ncall an API\n     ↓\nnetwork error\n     ↓\nretry\n```\n\nA worker can attempt a job several times before giving up:\n\n```php\n#[Tries(3)]\n```\n\nAnd the important question is not how many, it is <b>why did it fail?</b>\n\n```text\na temporary network failure    retrying works\nan invalid database record     retrying changes nothing\na programming bug              retrying changes nothing,\n                                 three times\n```\n\n<b>Retrying a permanent failure is not harmless.</b> It occupies a worker three times, delays every other job, and buries the real error under three identical stack traces.\n\nDay 22 made the same point about HTTP retries, and it has the same answer: retry transient failures, and fail fast on everything else.\n\n---\n\n### 2. Intermediate — backoff and timeouts\n\nRetrying immediately is worse than not retrying:\n\n```text\nfail → retry → fail → retry → fail\n```\n\nThat is three requests in a hundred milliseconds at a service that is already struggling, which is how a slow dependency becomes a dead one.\n\n<b>Backoff waits, and waits longer each time:</b>\n\n```text\nfail → wait 10s → retry → wait 30s → retry → wait 60s → retry\n```\n\n```php\n#[Backoff([10, 30, 60])]\n```\n\nThe growing delay is the point: it gives whatever broke time to recover, and it stops your workers being the reason it cannot.\n\n<b>A timeout stops a job hanging forever:</b>\n\n```text\njob starts\n   ↓\nan HTTP call that never answers\n   ↓\nthe worker is stuck\n```\n\n```php\n#[Timeout(120)]\n```\n\nWithout one, a single hung job holds a worker indefinitely. Enough of those and every worker is stuck on nothing.\n\n<b>Set it from the work, not from fear.</b> A ninety-second job with a one-hour timeout means an hour before anybody notices it hung. And <b>the worker's `--timeout` must be shorter than the driver's `retry_after`</b>, or the queue hands the job to a second worker while the first is still running it.\n\n---\n\n### 3. Advanced — telling the two kinds apart\n\nSome failures should stop immediately:\n\n```text\ninvalid input\npermission denied\na permanent business rule violation\na record that no longer exists\n```\n\n<b>Retrying those is three attempts at the same wrong answer.</b>\n\n```text\ntransient failure  →  retry\npermanent failure  →  fail immediately\n```\n\nLaravel gives you several ways to say which is which:\n\n```php\npublic function failOnException(): array\n{\n    return [InvalidInputException::class];\n}\n```\n\nor `$this->fail($e)` inside `handle()`, or `release()` to put a job back deliberately.\n\nAnd two more limits worth knowing.\n\n<b>`retryUntil()` sets a deadline instead of a count</b>, which is often what you actually mean: \"keep trying for an hour\" rather than \"try five times\", because five attempts with growing backoff could be four minutes or four hours.\n\n<b>`maxExceptions` limits failures separately from attempts</b>, which matters for a long-running job that releases itself.\n\nThe judgement that ties it together, and it is the one that separates a queue that works from one that hurts:\n\n```text\nWill retrying this produce a different result?\n\n  yes  →  retry, with backoff\n  no   →  fail now, loudly, with the real error visible\n```\n\nAnd the second half of that: <b>a retried job must be safe to run twice.</b> If attempt one charged a card and then timed out, attempt two charges it again. Idempotency is not a separate topic from retries; it is the thing that makes retries safe.",
      diagram: `Retries

    call an API → network error → retry

    #[Tries(3)]

  The question is not how many. It is WHY did it fail?

    a temporary network failure   retrying works
    an invalid database record    retrying changes nothing
    a programming bug             retrying changes nothing,
                                    three times

  ⚠️  Retrying a permanent failure is not harmless. It
      occupies a worker three times, delays every other
      job, and buries the real error under three
      identical stack traces.


Backoff

  Retrying immediately is worse than not retrying:

    fail → retry → fail → retry → fail

  Three requests in a hundred milliseconds, at a service
  already struggling. That is how a slow dependency
  becomes a dead one.

    fail → wait 10s → retry → wait 30s → retry
         → wait 60s → retry

    #[Backoff([10, 30, 60])]

  The growing delay gives whatever broke time to
  recover, and stops your workers being the reason it
  cannot.


Timeouts

    job starts → an HTTP call that never answers
               → the worker is stuck

    #[Timeout(120)]

  Without one, a single hung job holds a worker
  indefinitely. Enough of those and every worker is
  stuck on nothing.

  Set it from the WORK, not from fear. A ninety-second
  job with a one-hour timeout means an hour before
  anybody notices it hung.

  ⚠️  The worker's --timeout must be SHORTER than the
      driver's retry_after, or the queue hands the job
      to a second worker while the first is still
      running it.


Telling the two kinds apart

    invalid input · permission denied
    a permanent rule violation · a record that is gone

  Retrying those is three attempts at the same wrong
  answer.

    transient  →  retry
    permanent  →  fail immediately

    failOnException()   these exceptions stop the job
    \$this->fail(\$e)     stop, from inside handle()
    release()           put it back, deliberately

  retryUntil()    a DEADLINE instead of a count, which
                  is often what you meant: "keep trying
                  for an hour" rather than "five times",
                  because five attempts with backoff
                  could be four minutes or four hours

  maxExceptions   limits failures separately from
                  attempts, for a job that releases
                  itself


The judgement

    Will retrying this produce a different result?

      yes  →  retry, with backoff
      no   →  fail now, loudly, with the real error visible


  And the second half:

    A retried job must be SAFE TO RUN TWICE.

  If attempt one charged a card and then timed out,
  attempt two charges it again.

  Idempotency is not a separate topic from retries.
  It is what makes retries safe.`,
      codeExample: {
        title: "Failing well",
        code: `<?php

namespace App\\Jobs;

use App\\Exceptions\\InvalidPodcastException;
use Illuminate\\Http\\Client\\ConnectionException;
use Illuminate\\Queue\\Attributes\\Backoff;
use Illuminate\\Queue\\Attributes\\Timeout;
use Illuminate\\Queue\\Attributes\\Tries;

#[Tries(5)]
#[Backoff([10, 30, 60, 120])]   // growing, not fixed
#[Timeout(120)]                  // from the work, not from fear
class SyncWithProvider implements ShouldQueue
{
    use Queueable;

    public function __construct(public Customer $customer) {}

    // Retrying these produces the same wrong answer.
    public function failOnException(): array
    {
        return [
            InvalidPodcastException::class,
            AuthorizationException::class,
        ];
    }

    // Often what you actually meant: keep trying for an
    // hour, rather than five times.
    public function retryUntil(): DateTime
    {
        return now()->addHour();
    }

    public function handle(): void
    {
        // Safe to run twice: attempt one may have
        // succeeded and then timed out.
        if ($this->customer->synced_at?->isAfter(now()->subHour())) {
            return;
        }

        $response = Http::timeout(30)
            ->withToken(config('services.provider.token'))
            ->post('/customers', $this->customer->toSyncPayload());

        // Permanent: stop now, with the real error visible.
        if ($response->status() === 422) {
            $this->fail(new InvalidPodcastException($response->body()));

            return;
        }

        // Transient: back off and try again later.
        if ($response->status() === 429) {
            $this->release(60);

            return;
        }

        $response->throw();

        $this->customer->update(['synced_at' => now()]);
    }

    public function failed(\\Throwable $e): void
    {
        // Runs after the final attempt.
        $this->customer->update(['sync_error' => $e->getMessage()]);
    }
}


<?php
// ---------- Why the failure kind matters ----------

// ❌ A validation error, retried five times with backoff.
//    Four minutes of worker time, five identical stack
//    traces, and the real error buried.

// ✓ failOnException() stops at the first attempt, and
//    the error is the first thing in the log.


<?php
// ---------- Backoff shapes ----------

#[Backoff(10)]                    // 10s each time
#[Backoff([10, 30, 60])]          // growing, then 60s
                                   // for the rest

// Growing is almost always right: a fixed delay still
// hammers a struggling service, just more slowly.


# ---------- The timeout relationship ----------

# The worker's timeout must be SHORTER than the driver's
# retry_after, or the queue reassigns a job that is
# still running.

# config/queue.php
#   'redis' => ['retry_after' => 90]

php artisan queue:work --timeout=60      # ✓ 60 < 90
php artisan queue:work --timeout=120     # ❌ the job runs twice


<?php
// ---------- Idempotency is what makes retries safe ----------

// ❌ Attempt one charged the card, then the response was
//    lost and the job timed out. Attempt two charges again.
public function handle(): void
{
    $this->gateway->charge($this->invoice->total);
    $this->invoice->update(['status' => 'paid']);
}

// ✓
public function handle(): void
{
    if ($this->invoice->status === 'paid') {
        return;
    }

    $this->gateway->charge(
        $this->invoice->total,
        idempotencyKey: $this->invoice->uuid,   // Day 22
    );

    $this->invoice->update(['status' => 'paid']);
}`,
      },
      keyTakeaways: [
        "<b>The question is not how many retries, but whether retrying will produce a different result.</b>",
        "<b>Retrying a permanent failure occupies a worker repeatedly</b> and buries the real error under identical traces.",
        "<b>Backoff waits between attempts, and a growing delay lets a struggling dependency recover.</b>",
        "Retrying immediately is worse than not retrying, because it adds load to something already failing.",
        "<b>A timeout stops one hung job from holding a worker indefinitely.</b>",
        "<b>Set the timeout from the work</b>, because an hour-long timeout on a ninety-second job hides a hang for an hour.",
        "<b>The worker's `--timeout` must be shorter than the driver's `retry_after`</b>, or the job runs twice at once.",
        "<b>`failOnException()` and `$this->fail()` stop a job that cannot succeed</b>, and `release()` puts one back deliberately.",
        "<b>`retryUntil()` sets a deadline rather than a count</b>, which is often what you actually meant.",
        "<b>A retried job must be safe to run twice</b>: idempotency is what makes retries safe, not a separate topic.",
      ],
      commonMistakes: [
        "<b>Retrying every failure.</b> A validation error retried five times is four minutes of worker time and a buried error.",
        "<b>Retrying with no backoff.</b> Three requests in a hundred milliseconds finishes off a struggling service.",
        "<b>Running jobs with no timeout.</b> One hung HTTP call occupies a worker forever.",
        "<b>Setting the worker timeout above `retry_after`.</b> The queue hands the job to a second worker mid-run.",
        "<b>Enabling retries on a job that is not idempotent.</b> The first attempt charged the card; the second charges it again.",
      ],
      quiz: [
        {
          question: "What decides whether a job should be retried?",
          options: [
            "How long it takes",
            "Whether retrying could produce a different result",
            "How many workers are free",
            "Which queue it is on",
          ],
          correctIndex: 1,
          explanation: "A permanent failure retried is the same wrong answer, three times.",
        },
        {
          question: "Why does backoff grow between attempts?",
          options: [
            "To reduce database load",
            "To give a struggling dependency time to recover instead of adding load",
            "Laravel requires it",
            "To spread jobs across workers",
          ],
          correctIndex: 1,
          explanation: "Retrying immediately is how a slow service becomes a dead one.",
        },
        {
          question: "Why must a worker's `--timeout` be shorter than `retry_after`?",
          options: [
            "For memory",
            "Otherwise the queue reassigns the job while the first worker is still running it",
            "It is a config requirement",
            "To allow backoff",
          ],
          correctIndex: 1,
          explanation: "The job then runs twice, concurrently.",
        },
        {
          question: "What makes retries safe?",
          options: [
            "Backoff",
            "The job being idempotent, so running it twice has the same effect as once",
            "A short timeout",
            "A high `tries` value",
          ],
          correctIndex: 1,
          explanation: "Otherwise attempt two charges the card attempt one already charged.",
        },
      ],
    },
    {
      id: "unique-and-rate-limited",
      title: "Unique jobs & rate limiting",
      durationMinutes: 10,
      explanation: "Two ways of controlling how much work reaches the queue, and how fast it leaves.\n\n---\n\n### 1. Basic — the duplicate problem\n\n```php\nGenerateReport::dispatch($user);\n```\n\nFive requests arrive at once. Five identical jobs:\n\n```text\nGenerateReport 123\nGenerateReport 123\nGenerateReport 123\nGenerateReport 123\nGenerateReport 123\n```\n\nFive workers building the same report, four of them for nothing. And if the job writes, they may write over each other.\n\n<b>A <i>unique job</i></b> refuses to queue while one with the same key is already pending:\n\n```php\nclass GenerateReport implements ShouldQueue, ShouldBeUnique\n{\n    public function uniqueId(): string\n    {\n        return $this->user->id;\n    }\n}\n```\n\nNow the second dispatch is silently ignored. <b>Silently is the word to notice</b>: nothing errors, and nothing tells the caller their dispatch did nothing.\n\nWhat it suits:\n\n```text\nimports · report generation\nsynchronisation · recalculating something derived\n```\n\nAnything where doing it once is the same as doing it five times, and doing it five times is a waste.\n\n---\n\n### 2. Intermediate — the details that matter\n\n<b>Uniqueness is held by a lock, and a lock needs a lifetime:</b>\n\n```php\npublic int $uniqueFor = 3600;\n```\n\nWithout one, a job that dies in a way that skips its cleanup can leave a lock behind, and then <i>nothing</i> queues until it expires. Which is a hard failure to diagnose, because nothing is failing: dispatches simply do nothing.\n\n<b>The lock is released when the job starts by default</b>, so a second dispatch while the first is running is allowed. `ShouldBeUniqueUntilProcessing` is the explicit version of that, and plain `ShouldBeUnique` holds it until the job finishes.\n\n```text\nShouldBeUnique                   until it finishes\nShouldBeUniqueUntilProcessing    until it starts\n```\n\nWhich you want depends on whether a change during processing should produce another run.\n\n<b>And uniqueness needs a cache the workers share.</b> On the `array` driver it does nothing, and with several servers each has its own lock unless the cache is shared, exactly as with rate limiting on Day 21.\n\n---\n\n### 3. Advanced — rate limiting\n\nAn API says:\n\n```text\n100 requests per minute\n```\n\nAnd your queue has five thousand jobs, each making one call. Four workers will happily send them as fast as they can:\n\n```text\nWorker → rate limiter → API\n```\n\n<b>Without a limit, you get throttled, and then every one of those jobs fails and retries</b>, which sends even more requests. A rate limit is not politeness, it is what stops a queue turning a limit into an outage.\n\n```php\nRateLimiter::for('provider-api', fn () => Limit::perMinute(100));\n```\n\n```php\npublic function middleware(): array\n{\n    return [new RateLimited('provider-api')];\n}\n```\n\n<b>A rate-limited job that cannot run right now is released back to the queue</b>, not failed. So it waits and tries again, which is why the delay matters more than it looks: released too eagerly and the job bounces between the queue and the limiter thousands of times.\n\nThe other middleware worth knowing:\n\n```text\nRateLimited            fewer than N per period\nWithoutOverlapping     one at a time, per key\nSkipIfBatchCancelled   stop when the batch was cancelled\n```\n\n<b>`WithoutOverlapping` is the one people need and do not know exists.</b> Two jobs recalculating the same invoice concurrently is a race, and a key of `invoice-{id}` makes them queue behind each other rather than fight.\n\nWhich gives the pair a clean split:\n\n```text\nunique             do not queue the same work twice\nWithoutOverlapping do not RUN the same work twice at once\nRateLimited        do not run it faster than something else can take\n```",
      diagram: `The duplicate problem

    GenerateReport::dispatch(\$user)   × 5 requests

    GenerateReport 123
    GenerateReport 123
    GenerateReport 123     five workers, one report,
    GenerateReport 123     four of them for nothing
    GenerateReport 123

  And if the job writes, they may write over each other.

    implements ShouldBeUnique
    public function uniqueId(): string

  The second dispatch is silently ignored.

  ⚠️  SILENTLY. Nothing errors, and nothing tells the
      caller their dispatch did nothing.

  Suits: imports · report generation · synchronisation
         recalculating something derived


Details that matter

  Uniqueness is a LOCK, and a lock needs a lifetime:

    public int \$uniqueFor = 3600;

  ⚠️  Without one, a job that dies in a way that skips
      cleanup leaves the lock behind — and then NOTHING
      queues until it expires. A hard failure to
      diagnose, because nothing is failing: dispatches
      simply do nothing.

  ShouldBeUnique                 until it FINISHES
  ShouldBeUniqueUntilProcessing  until it STARTS

  Which you want depends on whether a change during
  processing should produce another run.

  And it needs a cache the workers SHARE. On the array
  driver it does nothing; across several servers each
  has its own lock unless the cache is shared — the
  same point as rate limiting on Day 21.


Rate limiting

  An API says 100 requests per minute.
  Your queue has 5,000 jobs, each making one call.
  Four workers send them as fast as they can.

    Worker → rate limiter → API

  ⚠️  Without a limit you get throttled, and then every
      one of those jobs FAILS AND RETRIES — which sends
      even more requests.

      A rate limit is not politeness. It is what stops a
      queue turning a limit into an outage.

    RateLimiter::for('provider-api',
        fn () => Limit::perMinute(100));

    public function middleware(): array
    {
        return [new RateLimited('provider-api')];
    }

  A limited job that cannot run is RELEASED back to the
  queue, not failed. Which is why the delay matters:
  released too eagerly, it bounces between the queue and
  the limiter thousands of times.


  The middleware worth knowing:

    RateLimited           fewer than N per period
    WithoutOverlapping    one at a time, per key
    SkipIfBatchCancelled  stop when the batch was cancelled

  WithoutOverlapping is the one people need and do not
  know exists. Two jobs recalculating the same invoice
  concurrently is a race; a key of invoice-{id} makes
  them queue behind each other rather than fight.


The split

  unique               do not QUEUE the same work twice
  WithoutOverlapping   do not RUN it twice at once
  RateLimited          do not run it faster than
                       something else can take`,
      codeExample: {
        title: "Not queueing, not overlapping, not overwhelming",
        code: `<?php

namespace App\\Jobs;

use Illuminate\\Contracts\\Queue\\ShouldBeUnique;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Queue\\Middleware\\RateLimited;
use Illuminate\\Queue\\Middleware\\WithoutOverlapping;

// ---------- Unique: do not queue it twice ----------

class GenerateReport implements ShouldQueue, ShouldBeUnique
{
    use Queueable;

    public function __construct(public User $user) {}

    public function uniqueId(): string
    {
        return "report:{$this->user->id}";
    }

    // ⚠️ Without this, a job that dies badly leaves the
    //    lock behind and NOTHING queues until somebody
    //    notices. Dispatches simply do nothing.
    public int $uniqueFor = 3600;

    public function handle(): void
    {
        // ...
    }
}

// Five simultaneous dispatches, one job. The other four
// are ignored — silently, which is worth knowing when
// a caller expects a confirmation.


<?php
// ---------- Unique until it starts, or until it finishes ----------

use Illuminate\\Contracts\\Queue\\ShouldBeUniqueUntilProcessing;

// The lock is released when the job STARTS, so a change
// during processing queues another run.
class SyncCustomer implements ShouldQueue, ShouldBeUniqueUntilProcessing
{
    public function uniqueId(): string
    {
        return "sync:{$this->customer->id}";
    }
}


<?php
// ---------- Rate limiting ----------

// AppServiceProvider
RateLimiter::for('provider-api', function () {
    return Limit::perMinute(100);
});


// The job opts in.
class SyncWithProvider implements ShouldQueue
{
    public function middleware(): array
    {
        return [
            // Released back to the queue when the limit
            // is reached, with a delay so it does not
            // bounce thousands of times.
            (new RateLimited('provider-api'))->releaseAfter(30),
        ];
    }
}

// Without this: 5,000 jobs, four workers, and an API
// that allows 100 a minute. You get throttled, every
// job fails and retries, and the retries send more
// requests than the original run did.


<?php
// ---------- WithoutOverlapping: the one people miss ----------

class RecalculateInvoice implements ShouldQueue
{
    public function __construct(public Invoice $invoice) {}

    public function middleware(): array
    {
        return [
            // Two of these on the same invoice would race.
            (new WithoutOverlapping("invoice:{$this->invoice->id}"))
                ->releaseAfter(10)      // try again shortly
                ->expireAfter(180),     // and never hold the lock forever
        ];
    }
}

// Different invoices still run in parallel. Only the
// same one queues behind itself.


<?php
// ---------- The split ----------

// unique              do not QUEUE the same work twice
// WithoutOverlapping  do not RUN it twice at once
// RateLimited         do not run it faster than
//                     something else can take
//
// They solve different problems and combine freely:

class SyncCustomer implements ShouldQueue, ShouldBeUnique
{
    public function uniqueId(): string
    {
        return "sync:{$this->customer->id}";
    }

    public function middleware(): array
    {
        return [
            new WithoutOverlapping("sync:{$this->customer->id}"),
            new RateLimited('provider-api'),
        ];
    }
}`,
      },
      keyTakeaways: [
        "<b>Several simultaneous dispatches create several identical jobs</b>, most of them wasted and possibly racing.",
        "<b>A unique job refuses to queue while one with the same key is pending</b>, and the refusal is silent.",
        "It suits imports, report generation and synchronisation, where once is the same as five times.",
        "<b>Uniqueness is a lock, so `$uniqueFor` is essential</b>: a stuck lock means dispatches quietly do nothing.",
        "<b>`ShouldBeUnique` holds the lock until the job finishes; `ShouldBeUniqueUntilProcessing` until it starts.</b>",
        "It needs a cache the workers share, or each server keeps its own lock.",
        "<b>Without a rate limit, hitting a third-party limit makes every job fail and retry</b>, sending more requests than before.",
        "<b>A rate-limited job is released back to the queue rather than failed</b>, so the release delay matters.",
        "<b>`WithoutOverlapping` stops the same work running twice concurrently</b>, keyed per record.",
        "<b>Unique stops it queueing twice, `WithoutOverlapping` stops it running twice, `RateLimited` stops it going too fast.</b>",
      ],
      commonMistakes: [
        "<b>Omitting `$uniqueFor`.</b> A stuck lock blocks every future dispatch, and nothing reports an error.",
        "<b>Expecting a duplicate dispatch to complain.</b> It is silently discarded.",
        "<b>Relying on uniqueness with an array cache or unshared cache across servers.</b> Each worker keeps its own lock.",
        "<b>Not rate limiting a queue that calls a limited API.</b> The throttling causes retries, which cause more throttling.",
        "<b>Using unique when you needed `WithoutOverlapping`.</b> One prevents queueing, the other prevents concurrent execution.",
      ],
      quiz: [
        {
          question: "What does a unique job prevent?",
          options: [
            "The job failing",
            "A second job with the same key being queued while one is pending",
            "Concurrent execution",
            "Retries",
          ],
          correctIndex: 1,
          explanation: "And the second dispatch is discarded silently.",
        },
        {
          question: "Why does `$uniqueFor` matter?",
          options: [
            "It sets the retry delay",
            "A lock left behind blocks every future dispatch until it expires",
            "It limits the queue size",
            "It sets the timeout",
          ],
          correctIndex: 1,
          explanation: "And the symptom is dispatches quietly doing nothing.",
        },
        {
          question: "What happens without a rate limit on jobs calling a limited API?",
          options: [
            "Jobs run slower",
            "You get throttled, those jobs fail and retry, and the retries send even more requests",
            "The API queues them",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "A rate limit is what stops a queue turning a limit into an outage.",
        },
        {
          question: "What does `WithoutOverlapping` do that unique does not?",
          options: [
            "Nothing",
            "It stops the same work running twice concurrently, rather than being queued twice",
            "It retries the job",
            "It rate limits the job",
          ],
          correctIndex: 1,
          explanation: "Two jobs recalculating one invoice at once is a race.",
        },
      ],
    },
    {
      id: "failures-supervisor-horizon",
      title: "Failed jobs, Supervisor & Horizon",
      durationMinutes: 14,
      explanation: "Everything so far was about writing jobs. This is about running them somewhere real.\n\n---\n\n### 1. Basic — failed jobs\n\nWhen a job exhausts its attempts, Laravel records it:\n\n```text\njob → attempts → failure → failed_jobs\n```\n\n```bash\nphp artisan queue:failed\n```\n\n```text\nid · connection · queue · exception · failed_at\n```\n\n<b>This is the first command to learn for production queues</b>, because it is the answer to \"the email never arrived\" that does not involve guessing.\n\nAnd the payload is stored with it, which is what makes the next command possible:\n\n```bash\nphp artisan queue:retry 9f2b...\nphp artisan queue:retry all\nphp artisan queue:retry --queue=emails\n```\n\n<b>Retrying one failed job, rather than replaying a run</b>, is the point. Ninety-nine succeeded and one failed; you want the one.\n\n```bash\nphp artisan queue:flush\n```\n\nremoves the records. <b>That is cleanup, not recovery.</b> Flushing loses the payloads, so those jobs can never be retried, and loses the history of what went wrong. Read before you flush.\n\nA `failed()` method on the job runs after the last attempt, which is where a status update or an alert belongs.\n\n---\n\n### 2. Intermediate — keeping workers alive\n\nA worker started by hand is not a production system:\n\n```text\nthe worker crashes\nthe server restarts\nPHP runs out of memory\n```\n\nand nothing is processing anything, silently, until somebody notices.\n\n<b>A process manager restarts them.</b> Supervisor is the usual one:\n\n```text\nSupervisor\n    ├── worker 1\n    ├── worker 2\n    ├── worker 3\n    └── worker 4\n```\n\n```text\na worker dies → Supervisor notices → it starts another\n```\n\nWhich is also what makes `--max-jobs` and `--max-time` from the workers lesson safe: <b>a worker exiting on purpose is only a good idea if something starts a new one.</b>\n\nAnd more workers is how a queue scales:\n\n```text\n1 worker    job → job → job → ...\n\n4 workers   Worker 1 ─┐\n            Worker 2 ─┼→ Queue\n            Worker 3 ─┤\n            Worker 4 ─┘\n```\n\nFour workers, four jobs at once, which is the moment idempotency stops being theoretical: <b>two workers can now genuinely process related jobs at the same time.</b>\n\nAnd the priorities from the routing lesson, applied here:\n\n```text\nhigh      payments · password resets\ndefault   email · notifications\nlow       analytics · cleanup · imports\n```\n\n---\n\n### 3. Advanced — Horizon\n\nOn Redis, <b>Horizon is the answer to \"why are our jobs slow?\"</b>\n\n```text\nRedis\n  ↓\nHorizon\n  ├── jobs\n  ├── throughput\n  ├── runtime\n  ├── wait time\n  ├── failures\n  ├── workers\n  └── balancing\n```\n\nWithout it, a queue is a black box: jobs go in, something happens, and your only evidence is that a customer says they did not get an email.\n\n<b>Wait time is the metric that matters most</b>, and it is the one nobody thinks to look at. A job that runs in 200ms but sits in the queue for eleven minutes is a slow feature, and neither the code nor the logs say so.\n\nHorizon also balances workers by workload:\n\n```text\nbefore                     after balancing\n\npodcasts  ███████████      podcasts → many workers\nemails    ██               emails   → few workers\n```\n\nRather than a fixed split that leaves workers idle on an empty queue while another has ten thousand jobs waiting.\n\n---\n\n### Pausing, and the whole picture\n\n```bash\nphp artisan queue:pause --all\n```\n\n<b>Pausing is not deleting.</b> Jobs stay queued; workers stop taking new ones. Which is what you want during a deploy, a migration, a dependency outage, or an incident where you would rather nothing ran than everything failed.\n\n```text\n                       Laravel\n                          │\n                     dispatch()\n                          ↓\n                        Queue\n            ┌─────────────┼─────────────┐\n            ↓             ↓             ↓\n         Redis           SQS         Database\n            ↓\n      Queue workers\n            ↓\n        handle()\n            ↓\n  external service · database · storage\n\nSupervisor  keeps workers alive\nHorizon     shows you what they are doing\n```\n\nAnd the question this day exists to answer. Not \"how do I dispatch a job\", but:\n\n> <b>What happens if this job runs twice, fails halfway through, takes ten minutes, is retried five times, the external API is down, or a hundred thousand of them arrive at once?</b>\n\n<b>A job you can answer that about is production code.</b> One you cannot is a function you moved off the request and hoped about.",
      diagram: `Failed jobs

    job → attempts → failure → failed_jobs

    php artisan queue:failed

      id · connection · queue · exception · failed_at

  The first command to learn for production queues: the
  answer to "the email never arrived" that does not
  involve guessing.

  The payload is stored too, which is what makes this
  possible:

    php artisan queue:retry 9f2b...
    php artisan queue:retry all
    php artisan queue:retry --queue=emails

  Retrying ONE failed job rather than replaying a run.
  Ninety-nine succeeded; you want the one.

    php artisan queue:flush

  ⚠️  Cleanup, not recovery. Flushing loses the payloads
      — those jobs can never be retried — and loses the
      history of what went wrong. Read before you flush.

  A failed() method on the job runs after the last
  attempt: a status update, or an alert.


Keeping workers alive

  A worker started by hand is not a production system:

    the worker crashes · the server restarts
    PHP runs out of memory

  and nothing is processing anything, silently.

    Supervisor
        ├── worker 1
        ├── worker 2
        ├── worker 3
        └── worker 4

    a worker dies → Supervisor notices → starts another

  Which is what makes --max-jobs safe: a worker exiting
  on purpose is a good idea only if something starts a
  new one.

  And more workers is how a queue scales:

    1 worker    job → job → job → ...

    4 workers   Worker 1 ─┐
                Worker 2 ─┼→ Queue
                Worker 3 ─┤
                Worker 4 ─┘

  Four jobs at once — the moment idempotency stops being
  theoretical.


Horizon

    Redis → Horizon
              ├── jobs        ├── failures
              ├── throughput  ├── workers
              ├── runtime     └── balancing
              └── WAIT TIME

  Without it a queue is a black box: jobs go in,
  something happens, and your evidence is a customer
  saying they got no email.

  ⚠️  Wait time is the metric that matters most and the
      one nobody looks at. A job that RUNS in 200ms and
      WAITS eleven minutes is a slow feature, and
      neither the code nor the logs say so.

  Balancing:

    before                  after

    podcasts ███████████    podcasts → many workers
    emails   ██             emails   → few workers

  Rather than a fixed split leaving workers idle while
  another queue has ten thousand jobs waiting.


Pausing, and the whole picture

    php artisan queue:pause --all

  Pausing is NOT deleting. Jobs stay queued; workers
  stop taking new ones. For a deploy, a migration, a
  dependency outage, or an incident where you would
  rather nothing ran than everything failed.


                       Laravel
                          │
                     dispatch()
                          ↓
                        Queue
            ┌─────────────┼─────────────┐
            ↓             ↓             ↓
         Redis           SQS         Database
            ↓
      Queue workers
            ↓
        handle()
            ↓
  external service · database · storage

  Supervisor  keeps workers alive
  Horizon     shows you what they are doing


The question this day exists for

  Not "how do I dispatch a job", but:

    What happens if this job runs twice, fails halfway
    through, takes ten minutes, is retried five times,
    the external API is down, or a hundred thousand of
    them arrive at once?

  A job you can answer that about is production code.
  One you cannot is a function you moved off the
  request and hoped about.`,
      codeExample: {
        title: "Operating a queue",
        code: `# ---------- Failed jobs ----------

php artisan queue:failed

# id                                    queue    exception
# 9f2b1c3d-...                          emails   ConnectionException

php artisan queue:failed --json | jq '.[0].exception'


# Retry the one that failed, not the ninety-nine that worked.
php artisan queue:retry 9f2b1c3d-...
php artisan queue:retry all
php artisan queue:retry --queue=emails

php artisan queue:forget 9f2b1c3d-...     # drop one

# ⚠️ Cleanup, not recovery. The payloads go with it.
php artisan queue:flush


<?php
// ---------- The last-attempt hook ----------

class SyncWithProvider implements ShouldQueue
{
    public function failed(\\Throwable $e): void
    {
        // After the final attempt. A status, or an alert.
        $this->customer->update([
            'sync_status' => 'failed',
            'sync_error'  => $e->getMessage(),
        ]);

        Notification::route('slack', config('services.slack.ops'))
            ->notify(new SyncFailed($this->customer, $e));
    }
}


# ---------- Supervisor ----------

# /etc/supervisor/conf.d/worker.conf

[program:invoicehub-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --queue=high,default,low --tries=3 --timeout=60 --max-time=3600
autostart=true
autorestart=true
stopwaitsecs=3600
numprocs=4
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/worker.log

# autorestart      a crashed worker comes back
# numprocs=4       four jobs at once
# stopwaitsecs     let a running job finish on shutdown
# --max-time       exit deliberately; Supervisor restarts

# A dedicated worker for anything that must not wait:
# command=php /var/www/artisan queue:work redis --queue=high


# ---------- In the deploy script ----------

php artisan queue:restart

# Otherwise workers keep running the code they booted with.


# ---------- Pausing ----------

php artisan queue:pause --all
# Jobs stay queued. Workers stop taking new ones.
# For a deploy, a migration, or a dependency outage.

php artisan queue:resume --all


<?php
// ---------- Horizon ----------

// composer require laravel/horizon
// php artisan horizon:install

// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-urgent' => [
            'connection'   => 'redis',
            'queue'        => ['high'],
            'balance'      => 'simple',
            'processes'    => 2,     // never blocked by anything else
            'tries'        => 3,
        ],

        'supervisor-default' => [
            'connection'   => 'redis',
            'queue'        => ['default', 'podcasts', 'imports'],

            // Workers follow the workload rather than a
            // fixed split.
            'balance'      => 'auto',
            'minProcesses' => 1,
            'maxProcesses' => 10,
            'tries'        => 3,
            'timeout'      => 60,
        ],
    ],
],

// Horizon replaces the queue:work lines in Supervisor,
// and Supervisor then keeps horizon itself alive:
//   command=php /var/www/artisan horizon


# ---------- What to look at first ----------

# Throughput   how many jobs a minute
# Runtime      how long each takes
# WAIT TIME    how long they sit before starting  ← this one
# Failures     what is breaking, and how often
#
# A job that runs in 200ms and waits eleven minutes is a
# slow feature, and nothing in the code or the logs
# says so.`,
      },
      keyTakeaways: [
        "<b>A job that exhausts its attempts is recorded in `failed_jobs`</b>, with its payload and its exception.",
        "<b>`queue:failed` is the first command to learn</b>, because it answers \"it never arrived\" without guessing.",
        "<b>`queue:retry` replays one failed job</b> rather than a whole run, which is the point of storing the payload.",
        "<b>`queue:flush` is cleanup, not recovery</b>: it discards the payloads and the history of what broke.",
        "A `failed()` method on the job runs after the final attempt, for a status update or an alert.",
        "<b>A worker started by hand is not a production system</b>, because a crash means nothing runs and nothing says so.",
        "<b>Supervisor restarts workers</b>, which is what makes `--max-jobs` and `--max-time` a safe strategy.",
        "<b>More workers means more jobs at once</b>, which is where idempotency stops being theoretical.",
        "<b>Horizon shows throughput, runtime, wait time, failures and worker activity</b> for Redis queues.",
        "<b>Wait time is the metric nobody checks</b>: a fast job that queues for eleven minutes is a slow feature.",
        "<b>Horizon balances workers by workload</b> rather than a fixed split that leaves some idle.",
        "<b>Pausing stops workers taking new jobs without deleting anything</b>, which is what a deploy or an outage needs.",
        "<b>The question is what happens on a retry, a timeout, an outage or a hundred thousand jobs</b>, not how to dispatch one.",
      ],
      commonMistakes: [
        "<b>Running `queue:flush` before reading the failures.</b> The payloads are gone and nothing can be retried.",
        "<b>Retrying everything when one job failed.</b> The ninety-nine that succeeded run again.",
        "<b>Running workers without a process manager.</b> A crash means nothing is processed, silently.",
        "<b>Never looking at wait time.</b> The job is fast and the feature is slow, and nothing in the logs explains it.",
        "<b>Assuming a paused queue has lost its jobs.</b> Pausing stops processing; it does not delete.",
      ],
      quiz: [
        {
          question: "What does `queue:flush` do?",
          options: [
            "Retries every failed job",
            "Deletes the failed-job records, including their payloads, so they can never be retried",
            "Clears the pending queue",
            "Restarts the workers",
          ],
          correctIndex: 1,
          explanation: "Cleanup, not recovery. Read before you flush.",
        },
        {
          question: "Why does a production queue need a process manager?",
          options: [
            "For performance",
            "A crashed or exited worker means nothing is processed, and nothing reports it",
            "To run migrations",
            "To pause the queue",
          ],
          correctIndex: 1,
          explanation: "It is also what makes `--max-time` a safe strategy.",
        },
        {
          question: "Which Horizon metric is most often ignored and most revealing?",
          options: ["Throughput", "Runtime", "Wait time", "Failures"],
          correctIndex: 2,
          explanation: "A 200ms job that queues for eleven minutes is a slow feature.",
        },
        {
          question: "What does `queue:pause` do to queued jobs?",
          options: [
            "Deletes them",
            "Nothing; they stay queued while workers stop taking new ones",
            "Retries them",
            "Moves them to failed_jobs",
          ],
          correctIndex: 1,
          explanation: "Which is what a deploy or a dependency outage needs.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What question decides whether work belongs in a queue?",
      options: [
        "Is it slow?",
        "Does the user need it finished before they get a response?",
        "Does it touch the database?",
        "Is it called often?",
      ],
      correctIndex: 1,
      explanation: "The request does the minimum that must be true before answering.",
    },
    {
      question: "How is a model stored when passed into a job?",
      options: [
        "As a serialised copy",
        "As an id, and re-fetched when the job runs",
        "As JSON",
        "It cannot be passed",
      ],
      correctIndex: 1,
      explanation: "Which is why the job sees edits made after dispatch.",
    },
    {
      question: "What is wrong with using `dispatchSync()` because the queue is not configured?",
      options: [
        "Nothing",
        "The code reads and reviews as queued while blocking the request",
        "It fails silently",
        "It cannot be tested",
      ],
      correctIndex: 1,
      explanation: "`dispatchAfterResponse()` frees the user but still holds the PHP process.",
    },
    {
      question: "Why does a code change not affect a running worker?",
      options: [
        "The config is cached",
        "A worker is a long-running process still executing the code it booted with",
        "Jobs are compiled",
        "It does",
      ],
      correctIndex: 1,
      explanation: "`queue:restart` belongs in every deploy script.",
    },
    {
      question: "When should you use a chain rather than a batch?",
      options: [
        "When there are many jobs",
        "When each job depends on the previous one succeeding",
        "When the jobs are slow",
        "When failures are likely",
      ],
      correctIndex: 1,
      explanation: "A batch is for independent jobs you want to track as one unit.",
    },
    {
      question: "What does a batch give you that individual dispatches do not?",
      options: [
        "Faster execution",
        "One unit to track, with progress and a `then()` when everything succeeded",
        "Automatic retries",
        "Ordering",
      ],
      correctIndex: 1,
      explanation: "Otherwise, knowing when a hundred jobs finished is a polling loop.",
    },
    {
      question: "What decides which queue a job belongs on?",
      options: [
        "How long it takes",
        "Who is waiting for it",
        "How often it runs",
        "Which model it touches",
      ],
      correctIndex: 1,
      explanation: "A password reset is trivial work somebody is watching.",
    },
    {
      question: "What decides whether a failed job should be retried?",
      options: [
        "How many attempts are left",
        "Whether retrying could produce a different result",
        "The queue it is on",
        "How long it ran",
      ],
      correctIndex: 1,
      explanation: "A permanent failure retried is the same wrong answer, three times.",
    },
    {
      question: "Why must a worker's `--timeout` be shorter than the driver's `retry_after`?",
      options: [
        "For memory",
        "Otherwise the queue reassigns the job while the first worker is still running it",
        "It is a config requirement",
        "To enable backoff",
      ],
      correctIndex: 1,
      explanation: "The job then runs twice, at the same time.",
    },
    {
      question: "What makes retries safe?",
      options: [
        "Backoff",
        "The job being idempotent, so a second run has the same effect as the first",
        "A short timeout",
        "A low `tries` value",
      ],
      correctIndex: 1,
      explanation: "Otherwise attempt two charges the card attempt one already charged.",
    },
    {
      question: "What happens without `$uniqueFor` on a unique job?",
      options: [
        "Nothing",
        "A lock left behind blocks every future dispatch until it expires, silently",
        "The job runs twice",
        "The queue fills up",
      ],
      correctIndex: 1,
      explanation: "The symptom is dispatches quietly doing nothing.",
    },
    {
      question: "What does `WithoutOverlapping` prevent that a unique job does not?",
      options: [
        "Nothing",
        "The same work running twice concurrently, rather than being queued twice",
        "Rate limiting",
        "Failures",
      ],
      correctIndex: 1,
      explanation: "Two jobs recalculating one invoice at once is a race.",
    },
    {
      question: "What does `queue:flush` do?",
      options: [
        "Retries the failed jobs",
        "Deletes the failed-job records and their payloads, so they can never be retried",
        "Clears the pending queue",
        "Restarts workers",
      ],
      correctIndex: 1,
      explanation: "Cleanup, not recovery.",
    },
    {
      question: "Which Horizon metric most often explains a slow feature?",
      options: ["Throughput", "Runtime", "Wait time", "Memory"],
      correctIndex: 2,
      explanation: "A 200ms job that sits in the queue for eleven minutes.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Move InvoiceHub's slow work off the request, then break it on purpose: fail one job in a hundred, retry only that one, and prove nothing ran twice.",
    brief: "InvoiceHub does everything during the request. Generating a PDF, sending the email, syncing to the accounting provider: all of it happens while somebody watches a spinner.\n\nToday it moves to a queue, and the interesting half is not the moving. <b>It is what happens when things go wrong.</b> A queue that works when everything works is not a queue you can run; the day is about the retry, the timeout, the duplicate and the failure.\n\nSo the centrepiece is deliberate: dispatch a hundred jobs, make one of them fail, and end with a hundred completed without the ninety-nine having run twice. If you cannot prove that last part, the exercise is not finished.\n\nRun a real driver from the start. Set `QUEUE_CONNECTION=redis` or `database` before you write a line, because `sync` will hide every behaviour this day is about.",
    steps: [
      "Set `QUEUE_CONNECTION` to a real driver and run the migrations for jobs, failed jobs and batches. Confirm a dispatched job appears in the store before any worker runs.",
      "Create `GenerateInvoicePdf` and move the PDF generation out of the controller. Time the request before and after, and record both numbers.",
      "Dispatch it, then edit the invoice before the worker picks it up. Look at the generated PDF and write down which version of the data it used, and why.",
      "Chain `GenerateInvoicePdf` then `SendInvoiceEmail`. Make the PDF job fail and confirm no email was sent.",
      "Add a `failed()` method that marks the invoice as failed, and check the record after a failure.",
      "Now the centrepiece: seed 100 invoices and dispatch a batch of `GenerateInvoicePdf`. Make invoice 50 throw. Use `allowFailures()` so the other 99 continue.",
      "Add `then()` and `catch()` callbacks that log the outcome, and a `progress()` callback that writes the percentage somewhere you can watch.",
      "Run the batch. Record how many completed and how many failed, then find the failure with `queue:failed`.",
      "Fix the cause, retry only that job with `queue:retry <id>`, and prove from your logs or a counter that the other 99 did not run again. This is the acceptance criterion for the whole day.",
      "Add a `SyncToAccounting` job calling an external API. Give it `#[Tries]`, growing `#[Backoff]` and a `#[Timeout]` set from how long the call actually takes.",
      "Point it at a URL that returns 500 and watch the attempts and the delays. Then point it at one returning 422 and add `failOnException()` so it stops at the first attempt. Compare the two logs.",
      "Make the job idempotent: run it twice against the same invoice and confirm the provider was called once. Then remove the guard, run it twice, and confirm it was called twice.",
      "Set the worker's `--timeout` higher than the driver's `retry_after` deliberately, run a slow job, and observe what happens. Then fix it and write down what you saw.",
      "Make `SyncToAccounting` unique per invoice with a `$uniqueFor`. Dispatch it five times in a loop and confirm only one job was queued.",
      "Add a rate limiter for the accounting API and apply it as job middleware. Dispatch 200 jobs and confirm from the timestamps that they are spread rather than sent at once.",
      "Split the queues: `high` for anything a person is waiting for, `default`, and `low` for bulk PDF generation. Route the jobs with `Queue::route()` in one place.",
      "Run one worker on `--queue=high` alone and another on the rest. Fill the low queue with 500 jobs, then dispatch a password reset and time how long it waits.",
      "Write a Supervisor config with four workers, `autorestart`, and `--max-time`. Kill a worker and confirm it comes back.",
      "Add `queue:restart` to your deploy notes. Then change a job's code without restarting, dispatch it, and confirm the old code ran.",
      "If you are on Redis, install Horizon and watch a batch run. Record the throughput, the runtime and the wait time, and say which of the three would have told you about a problem first.",
      "Finally, pick your most important job and answer in writing: what happens if it runs twice, fails halfway, takes ten minutes, is retried five times, the API is down, or a hundred thousand arrive at once.",
    ],
    acceptance: [
      "The invoice request no longer generates a PDF, and you recorded the timing before and after.",
      "A chain stops after a failure, and no email is sent when the PDF job fails.",
      "A batch of 100 completes 99 and records 1 failure, with progress visible while it runs.",
      "Retrying the single failed job brings the total to 100, and you can prove the other 99 did not run again.",
      "A 500 from the API produces retries with growing delays; a 422 fails on the first attempt.",
      "`SyncToAccounting` run twice calls the provider once, and you demonstrated the unguarded version calling it twice.",
      "You observed what a `--timeout` longer than `retry_after` does, and fixed it.",
      "Five dispatches of the unique job queue one job.",
      "200 rate-limited jobs are spread over time rather than sent at once, shown by their timestamps.",
      "A password reset dispatched behind 500 low-priority jobs is processed promptly, because of a dedicated worker.",
      "A killed worker is restarted by Supervisor.",
      "You demonstrated a job running old code before a `queue:restart`.",
      "You have written answers for your most important job about running twice, failing halfway, timing out, being retried, the API being down, and arriving in bulk.",
    ],
    stretch: [
      "Build a batch of chains: each invoice's PDF then email, with the invoices processed in parallel, and show the batch progress while it runs.",
      "Add `WithoutOverlapping` to a recalculation job and demonstrate the race it prevents by removing it and running two workers.",
      "Pause the queue during a simulated deploy, dispatch jobs while paused, resume, and confirm nothing was lost.",
    ],
  },
};
