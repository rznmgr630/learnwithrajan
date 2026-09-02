import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_34_LESSONS: LessonDay = {
  day: 34,
  title: "Deployment — CI/CD, workers, scheduler & zero downtime",
  totalMinutes: 95,
  difficulty: "Advanced",
  lessons: [
    {
      id: "the-production-picture",
      title: "What you are actually deploying",
      durationMinutes: 11,
      explanation: "The shift this elective asks for:\n\n> <b>Deployment is not uploading Laravel files. It is making the whole application reliably runnable, observable, recoverable and updatable in production.</b>\n\n---\n\n### 1. Basic — the shape of a production system\n\n```text\n                internet\n                   ↓\n             load balancer\n           ┌───────┴───────┐\n       Laravel app 1   Laravel app 2\n           └───────┬───────┘\n                database\n           ┌───────┴───────┐\n         Redis             S3\n       ┌───┴───┐\n    workers  scheduler\n```\n\nAnd wrapped around all of it:\n\n```text\nlogging · monitoring · backups · CI/CD · secrets\n```\n\n<b>That is what you are deploying.</b> Not a folder of PHP.\n\n---\n\n### 2. Intermediate — the five layers\n\nRather than memorising a checklist, hold the layers:\n\n```text\n1 application     Laravel, PHP, built assets\n2 infrastructure  server, Cloud, Docker, AWS\n3 processes       web, queue workers, scheduler\n4 data            database, Redis, storage, backups\n5 operations      CI/CD, monitoring, logs, recovery\n```\n\n<b>Layer 3 is the one people forget</b>, and it is where the classic first-deploy failure lives: the site loads, and nothing else works. Emails never send, because no worker is running. Nightly reports never run, because nothing invokes the scheduler.\n\n<b>Nothing errors.</b> `dispatch()` returns successfully, the job sits in Redis, and everybody assumes it worked.\n\n---\n\n### 3. Advanced — what \"deployed\" actually means\n\n<b>A deploy is not successful because the website loads.</b> It is successful when the application, workers, scheduler, database, configuration, monitoring and recovery strategy all work.\n\nThat matters because <b>each of those fails silently and independently.</b> A broken web server is loud, and you find out in seconds. Everything else in that list is quiet:\n\n```text\nworker not running        jobs queue up, nothing errors\nscheduler not invoked     reports simply do not arrive\nconfig cached wrong       one integration returns null\nlogs on one server        you cannot see the other two\nno error tracking         users hit exceptions you never learn about\nbackups never restored    you find out during the incident\n```\n\n<b>So the useful question is not \"did it deploy?\" but \"how would I know if this part were broken?\"</b> If the answer is \"a customer would tell me\", that piece is not deployed, it is merely running.\n\nOne more framing worth carrying: <b>everything in this elective is about the second deploy, not the first.</b> Getting a Laravel app onto a server once is an afternoon. Doing it repeatedly, safely, while people are using it, with a way back when it goes wrong, is the actual job.",
      diagram: `The shift

  Deployment is NOT uploading Laravel files.

  It is making the whole application reliably
  RUNNABLE · OBSERVABLE · RECOVERABLE · UPDATABLE.


A production system

                    internet
                       │
                       ▼
                 load balancer
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Laravel app 1       Laravel app 2
             │                   │
             └─────────┬─────────┘
                       ▼
                    database
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
           Redis                 S3
             │
       ┌─────┴─────┐
       ▼           ▼
    workers    scheduler

  and around all of it:

    logging · monitoring · backups · CI/CD · secrets

  That is what you are deploying. Not a folder of PHP.


The five layers

    1  APPLICATION      Laravel, PHP, built assets
    2  INFRASTRUCTURE   server, Cloud, Docker, AWS
    3  PROCESSES        web, queue workers, scheduler
    4  DATA             database, Redis, storage,
                        backups
    5  OPERATIONS       CI/CD, monitoring, logs,
                        recovery

  ⚠️  LAYER 3 IS THE ONE PEOPLE FORGET.

      The classic first-deploy failure: the site
      loads, and nothing else works.

        emails never send   → no worker running
        reports never run   → nothing invokes the
                              scheduler

      And NOTHING ERRORS. dispatch() returns
      successfully, the job sits in Redis, everybody
      assumes it worked.


What "deployed" actually means

  Not successful because the website loads.

  Successful when the application, workers,
  scheduler, database, configuration, monitoring AND
  recovery all work.

  Because each fails SILENTLY and INDEPENDENTLY:

    a broken web server        loud, seconds
    worker not running         jobs queue up, no error
    scheduler not invoked      reports just do not
                               arrive
    config cached wrong        one integration returns
                               null
    logs on one server         you cannot see the
                               other two
    no error tracking          users hit exceptions
                               you never learn about
    backups never restored     you find out during the
                               incident


  THE USEFUL QUESTION

    not "did it deploy?"
    but "HOW WOULD I KNOW IF THIS PART WERE BROKEN?"

    If the answer is "a customer would tell me", that
    piece is not deployed. It is merely running.


  And the framing for the whole elective:

    this is about the SECOND deploy, not the first

    getting Laravel onto a server once is an
    afternoon; doing it repeatedly, safely, while
    people are using it, with a way back when it goes
    wrong, is the actual job.`,
      codeExample: {
        title: "The layers, and how you would know each one is broken",
        code: `# ---------- Layer 1: application ----------

php artisan about                 # versions, cached state, drivers
php --version
node --version

# Would you know if it broke?  Yes — the site 500s.


# ---------- Layer 2: infrastructure ----------

systemctl status nginx php8.4-fpm
df -h                             # a full disk breaks everything, quietly
free -m

# Would you know?  Disk filling up: only if something
# watches it. This one bites at 3am.


# ---------- Layer 3: processes — the forgotten layer ----------

systemctl status supervisor
supervisorctl status              # are workers actually running?
crontab -l                        # is the scheduler invoked at all?

php artisan queue:monitor redis:default --max=100
php artisan schedule:list

# ⚠️ Would you know if the worker died?
#    dispatch() still succeeds. Jobs pile up in Redis.
#    Nothing errors. Nobody notices until a customer
#    asks where their invoice went.


<?php
// ---------- A health check that covers layer 3 ----------

Route::get('/health', function () {
    $checks = [
        'database'  => fn () => DB::select('select 1') !== [],
        'redis'     => fn () => Cache::store('redis')->get('health') !== false,

        // The queue is only healthy if something is DRAINING it
        'queue'     => fn () => Redis::connection('queue')->llen('queues:default') < 1000,

        // The scheduler writes this every minute
        'scheduler' => fn () => Cache::get('scheduler:heartbeat')
                                 && Cache::get('scheduler:heartbeat') > now()->subMinutes(5),
    ];

    $results = collect($checks)->map(function ($check) {
        try {
            return $check() ? 'ok' : 'failing';
        } catch (Throwable $e) {
            return 'error';
        }
    });

    return response()->json($results, $results->contains('ok') === false ? 503 : 200);
});

// routes/console.php — the heartbeat the check reads
Schedule::call(fn () => Cache::put('scheduler:heartbeat', now(), now()->addMinutes(10)))
    ->everyMinute();

// Now "the scheduler stopped" is a failing health check
// instead of a report nobody received.


# ---------- Layer 4: data ----------

php artisan migrate:status
# When did the last backup run? When was it last RESTORED?


# ---------- Layer 5: operations ----------

# Are logs from all three servers in one place?
# Does an exception reach a human?
# Can you answer "which release introduced this?"


<?php
// ---------- The question to ask of every piece ----------

// For each item:  how would I know if this were broken?
//
//   web server        it 500s              ✅ loud
//   queue worker      ???                  ⚠️ silent
//   scheduler         ???                  ⚠️ silent
//   config cache      one feature nulls    ⚠️ silent
//   backups           ???                  ⚠️ silent
//
// Anything answered "a customer would tell me" is not
// deployed. It is merely running.`,
      },
      keyTakeaways: [
        "<b>Deployment is making the application runnable, observable, recoverable and updatable</b>, not uploading files.",
        "<b>A production system is a load balancer, app servers, database, Redis, storage, workers and a scheduler.</b>",
        "<b>Logging, monitoring, backups, CI/CD and secrets wrap around all of it.</b>",
        "<b>Five layers: application, infrastructure, processes, data, operations.</b>",
        "<b>Processes is the forgotten layer</b>, and it is where the classic first-deploy failure lives.",
        "<b>Without a worker, `dispatch()` still succeeds</b> and the job sits in Redis forever.",
        "<b>Without something invoking the scheduler, reports simply do not arrive.</b>",
        "<b>A deploy is successful when everything works, not when the website loads.</b>",
        "<b>A broken web server is loud; everything else fails silently and independently.</b>",
        "<b>The useful question is \"how would I know if this were broken?\"</b>",
        "<b>If the answer is \"a customer would tell me\", it is running, not deployed.</b>",
        "<b>This elective is about the second deploy</b>, not getting it online once.",
      ],
      commonMistakes: [
        "<b>Treating a loading homepage as a successful deploy.</b> Workers and the scheduler may not exist.",
        "<b>Assuming `dispatch()` working means jobs run.</b> It only means Redis accepted the job.",
        "<b>No scheduler heartbeat.</b> The first sign is a report nobody received last week.",
        "<b>Health checks that only test the web server.</b> They pass while half the system is dead.",
        "<b>Deploying without a way back.</b> The first deploy is easy; the rollback is the job.",
      ],
      quiz: [
        {
          question: "Which deployment layer is most often forgotten?",
          options: [
            "Infrastructure",
            "Processes: queue workers and the scheduler",
            "Application",
            "Data",
          ],
          correctIndex: 1,
          explanation: "The site loads and nothing else works, with no errors anywhere.",
        },
        {
          question: "What happens when no queue worker is running?",
          options: [
            "`dispatch()` throws",
            "`dispatch()` succeeds, the job sits in Redis, and nothing errors",
            "Laravel runs the job inline",
            "The request fails",
          ],
          correctIndex: 1,
          explanation: "Nobody notices until a customer asks where their email went.",
        },
        {
          question: "What makes a deployment successful?",
          options: [
            "The website loads",
            "Application, workers, scheduler, database, config, monitoring and recovery all work",
            "Migrations ran",
            "CI passed",
          ],
          correctIndex: 1,
          explanation: "Every piece except the web server fails silently.",
        },
        {
          question: "What is the useful question to ask of each production component?",
          options: [
            "Is it fast?",
            "How would I know if this were broken?",
            "Is it documented?",
            "Does it scale?",
          ],
          correctIndex: 1,
          explanation: "\"A customer would tell me\" means it is running, not deployed.",
        },
      ],
    },
    {
      id: "the-deploy-sequence",
      title: "The deploy sequence, and why the order matters",
      durationMinutes: 12,
      explanation: "The commands are short. The order is the lesson.\n\n---\n\n### 1. Basic — the sequence\n\n```bash\ncomposer install --no-dev --optimize-autoloader\nphp artisan migrate --force\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\n```\n\n```text\ncode → dependencies → configuration → routes → views → migrations → ready\n```\n\n<b>`--no-dev`</b> skips PHPUnit, Pest, debugging tools and development utilities, which cuts deployment size, install time and <b>attack surface</b>. That last one is the real argument: a debug toolbar or a database-browser package reachable in production is a genuine hole, and the only reliable way not to expose one is not to install it.\n\n<b>`--optimize-autoloader`</b> builds a class map so PHP stops scanning the filesystem to resolve classes.\n\n---\n\n### 2. Intermediate — what each cache does\n\n```text\nconfig:cache   config/*.php → one compiled array\nroute:cache    routes       → a compiled representation\nview:cache     Blade        → precompiled PHP\n```\n\nAll three remove per-request work. Day 33 covered the details, including the trap worth repeating here: <b>after `config:cache`, `env()` returns `null` outside config files</b>, and changing `.env` does nothing until you re-run it.\n\n`php artisan optimize` runs the set, and `optimize:clear` undoes it. <b>Reach for `optimize:clear` when a deploy behaves strangely</b>: stale caches are the most common cause of \"but the code is right\".\n\n<b>And treat the current Laravel documentation as the source of truth</b> for exactly what `optimize` covers, since it has changed between versions.\n\n---\n\n### 3. Advanced — the order, and the two ways it goes wrong\n\n<b>Caching must come after everything it depends on.</b> Cache config before pulling the new `.env` and you have cached the old values; the code is new, the environment file is new, and the application disagrees with both. <b>That is one of the most confusing outages you can create.</b>\n\nSo: <b>clear first, then build, then cache.</b>\n\n<b>The second problem is subtler and more dangerous: migrations and code do not deploy at the same instant.</b>\n\n```text\nmigrate first  → new schema, old code running against it\ncode first     → new code, old schema underneath it\n```\n\n<b>There is no ordering that avoids the gap</b>, only a choice of which side you are exposed on, which is why the next lesson exists. For now the rule: <b>a migration must be safe against the code currently running</b>, in whichever order you choose.\n\nTwo more things that belong in every deploy script and are usually missing.\n\n<b>`php artisan queue:restart`.</b> Workers hold the old code in memory and will keep running it indefinitely. A deploy that does not restart them has deployed the web tier only.\n\n<b>And a failure must stop the deploy.</b> A script that continues past a failed `composer install` will happily cache config, restart workers and swap traffic to a half-installed release. <b>`set -e` at the top of the script is the cheapest reliability you will ever buy.</b>",
      diagram: `The sequence

    composer install --no-dev --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    code → dependencies → configuration → routes
         → views → migrations → ready

  --no-dev
    skips PHPUnit, Pest, debug tools, dev utilities
      smaller · faster · SMALLER ATTACK SURFACE

    that last one is the real argument: a debug
    toolbar or database browser reachable in
    production is a genuine hole, and the reliable
    way not to expose one is not to install it

  --optimize-autoloader
    a class map, so PHP stops scanning the filesystem


What each cache does

    config:cache   config/*.php → one compiled array
    route:cache    routes       → compiled form
    view:cache     Blade        → precompiled PHP

  ⚠️  After config:cache, env() returns null outside
      config files — and changing .env does nothing
      until you re-run it. (Day 33.)

    php artisan optimize
    php artisan optimize:clear    ← when a deploy
                                    behaves strangely

  Stale caches are the most common cause of
  "but the code is right".


  ⚠️  ORDER PROBLEM 1 — cache last

      Cache config BEFORE pulling the new .env and
      you have cached the OLD values.

        the code is new
        the env file is new
        the application disagrees with both

      One of the most confusing outages you can make.

        CLEAR FIRST → BUILD → CACHE


  ⚠️  ORDER PROBLEM 2 — the gap you cannot close

      Migrations and code do not deploy at the same
      instant.

        migrate first → new schema, OLD code running
                        against it
        code first    → new code, OLD schema under it

      There is NO ordering that avoids the gap. Only
      a choice of which side you are exposed on.

      → which is why the next lesson exists

      The rule for now: a migration must be safe
      against the code CURRENTLY RUNNING.


Two things usually missing

  php artisan queue:restart

    workers hold the old code in memory and keep
    running it indefinitely — a deploy without this
    has deployed the WEB TIER ONLY

  A failure must STOP the deploy

    a script that continues past a failed composer
    install will cache config, restart workers and
    swap traffic to a half-installed release

      set -e  is the cheapest reliability you will
      ever buy`,
      codeExample: {
        title: "A deploy script that fails safely",
        code: `#!/usr/bin/env bash
set -euo pipefail          # ← stop on the FIRST failure.
                           #   Without this, a failed composer
                           #   install still ends with traffic
                           #   pointed at a broken release.

cd /var/www/invoicehub

# ---------- 1. Code ----------
git fetch --all
git reset --hard origin/main

# ---------- 2. Dependencies ----------
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
npm ci
npm run build

# ---------- 3. Clear BEFORE caching ----------
# Cache config before the new .env is in place and you
# have cached the old values. The code is new, the env
# file is new, and the app disagrees with both.
php artisan optimize:clear

# ---------- 4. Database ----------
# --force because CI has nobody to type "yes"
php artisan migrate --force

# ---------- 5. Now cache, against the CURRENT state ----------
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ---------- 6. Processes ----------
# Workers hold the OLD code in memory. Without this you
# have deployed the web tier only.
php artisan queue:restart

# ---------- 7. Prove it ----------
curl -fsS https://invoicehub.com/health > /dev/null


# ---------- Why --no-dev is a security line, not a size one ----------

# In dev:
#   barryvdh/laravel-debugbar
#   laravel/telescope
#   a database browser package
#
# Any of those reachable in production is a real hole.
# The reliable way not to expose one is NOT TO INSTALL IT.

composer install --no-dev

# And keep them out of the autoloaded providers:
# composer.json
#   "extra": {
#     "laravel": {
#       "dont-discover": ["laravel/telescope"]
#     }
#   }


# ---------- --force, explained ----------

php artisan migrate
# > **Application In Production**
# > Are you sure you wish to run this command? (yes/no)
#
# CI has nobody sitting there typing yes. --force says
# "I know this is production; proceed."

php artisan migrate --force

# And the one you should also know:
php artisan migrate:status         # what has and has not run
php artisan migrate --pretend      # print the SQL, change nothing


# ---------- When a deploy behaves strangely ----------

php artisan optimize:clear
php artisan about                  # what is actually cached right now

# Stale caches are the most common cause of
# "but the code is right".


# ---------- ⚠️ The failure this script prevents ----------

# Without set -e:
#
#   composer install    ← fails, vendor/ is half-written
#   migrate --force     ← runs anyway
#   config:cache        ← caches a broken app
#   queue:restart       ← workers boot the broken app
#   [traffic switches]
#
# Exit code 0. Deploy "successful". Site down.`,
      },
      keyTakeaways: [
        "<b>The sequence is dependencies, migrations, then config, route and view caches.</b>",
        "<b>`--no-dev` cuts size and install time, and more importantly attack surface.</b>",
        "<b>A debug toolbar reachable in production is a real hole</b>, and not installing it is the reliable fix.",
        "<b>`--optimize-autoloader` builds a class map</b> so PHP stops scanning the filesystem.",
        "<b>`config:cache` compiles config, `route:cache` compiles routes, `view:cache` precompiles Blade.</b>",
        "<b>After `config:cache`, `env()` is `null` outside config files</b>, and `.env` edits need a re-cache.",
        "<b>`optimize:clear` is the first thing to try when a deploy behaves strangely.</b>",
        "<b>Clear first, build, then cache</b>, or you cache against the previous environment.",
        "<b>Migrations and code never deploy at the same instant</b>, so there is always a gap.",
        "<b>A migration must be safe against the code currently running</b>, in either order.",
        "<b>`queue:restart` is required</b>, or workers keep running the old code indefinitely.",
        "<b>`set -e` stops a failed step from becoming a successful-looking broken deploy.</b>",
      ],
      commonMistakes: [
        "<b>Caching config before pulling the new environment.</b> The application disagrees with both new files.",
        "<b>Installing dev dependencies in production.</b> Debug tools become an attack surface.",
        "<b>Forgetting `queue:restart`.</b> Workers run last week's code until somebody notices.",
        "<b>A deploy script with no `set -e`.</b> It reports success while swapping to a broken release.",
        "<b>Running `migrate` without `--force` in CI.</b> It waits for a confirmation nobody will type.",
        "<b>Assuming migration order avoids the code/schema gap.</b> It only moves which side is exposed.",
      ],
      quiz: [
        {
          question: "What is the strongest argument for `--no-dev`?",
          options: [
            "Faster installs",
            "Attack surface: debug and database-browser packages reachable in production are real holes",
            "Smaller repository",
            "Composer requires it",
          ],
          correctIndex: 1,
          explanation: "The reliable way not to expose one is not to install it.",
        },
        {
          question: "Why must caching come last in the deploy script?",
          options: [
            "It is slow",
            "Caching before the new code and `.env` are in place caches the previous values",
            "Laravel requires it",
            "It does not matter",
          ],
          correctIndex: 1,
          explanation: "The code is new, the env file is new, and the application disagrees with both.",
        },
        {
          question: "What is the unavoidable problem with migration ordering?",
          options: [
            "Migrations are slow",
            "Code and schema never deploy at the same instant, so one side always runs against the other's version",
            "`--force` is dangerous",
            "There is none",
          ],
          correctIndex: 1,
          explanation: "The migration must be safe against the code currently running.",
        },
        {
          question: "What does `set -e` prevent in a deploy script?",
          options: [
            "Slow deploys",
            "A failed step being followed by caching, worker restarts and a traffic switch to a broken release",
            "Permission errors",
            "Migration conflicts",
          ],
          correctIndex: 1,
          explanation: "Otherwise the script exits 0 and reports success.",
        },
      ],
    },
    {
      id: "migrations-and-zero-downtime",
      title: "Migrations in production & expand-contract",
      durationMinutes: 13,
      explanation: "The senior-level deployment problem, and the one that actually causes outages.\n\n---\n\n### 1. Basic — schema is part of the release\n\nDeploying code is not enough:\n\n```text\nversion 1: users\nversion 2: users, posts\n```\n\n```text\nnew code + new schema = the new version\n```\n\n```bash\nphp artisan migrate --force\n```\n\n<b>`--force` exists because CI has nobody to type \"yes\"</b> at the production confirmation prompt.\n\n---\n\n### 2. Intermediate — the two versions running at once\n\nHere is the problem. Version A expects:\n\n```text\nusers.name\n```\n\nVersion B expects:\n\n```text\nusers.full_name\n```\n\nYou rename the column. But during a rolling deploy, <b>both versions are running</b>:\n\n```text\nserver 1: version A → SELECT name → the column is gone → 500\nserver 2: version B → SELECT full_name → fine\n```\n\n<b>Half your traffic is now erroring</b>, and it stays that way until every server has the new code, which on a slow deploy is minutes.\n\n<b>And this is not only about rolling deploys.</b> A queue worker still running the old code hits exactly the same problem, and a worker that was mid-job when you migrated fails on a column that vanished underneath it.\n\n---\n\n### 3. Advanced — expand and contract\n\nThe fix is to split one breaking change into <b>several safe deploys</b>:\n\n```text\n1 EXPAND    add full_name, keep name\n2 DEPLOY    code writes both, reads full_name with a fallback\n3 MIGRATE   backfill name → full_name\n4 CONTRACT  a later deploy removes name\n```\n\n<b>At every point, both the old and new code work.</b> That is the whole property, and it is what makes zero-downtime deploys possible at all.\n\n<b>The cost is honest: four deploys instead of one</b>, spread across days. People skip it because it feels like ceremony, and then discover why it exists during an incident.\n\n<b>Three rules that follow from the same principle.</b>\n\n<b>Every migration must be safe against the code currently running.</b> Adding a nullable column is always safe. Dropping, renaming or adding a `NOT NULL` column without a default is never safe in one step.\n\n<b>Separate schema changes from data changes.</b> A migration that backfills a million rows holds a transaction open, and on MySQL a long `ALTER` can lock the table entirely while your deploy sits waiting. <b>Backfill in a chunked command or a queued job</b>, not in the migration.\n\n<b>And a migration must be reversible in practice, not just in `down()`.</b> `down()` that drops a column you spent a day backfilling is not a rollback, it is a second outage. <b>The real rollback plan for a bad deploy is deploying the previous code</b>, which only works if the schema still supports it, which is exactly what expand-contract guarantees.",
      diagram: `Schema is part of the release

    version 1: users
    version 2: users, posts

    new code + new schema = the new version

    php artisan migrate --force
                        └─ CI has nobody to type "yes"


  ⚠️  THE PROBLEM: two versions running at once

      version A expects   users.name
      version B expects   users.full_name

      You rename the column. During a rolling deploy:

        server 1  version A → SELECT name
                            → column gone → 500
        server 2  version B → SELECT full_name → fine

      HALF YOUR TRAFFIC IS ERRORING, and stays that
      way until every server has the new code.

      And not only rolling deploys: a queue worker on
      the old code hits the same thing, and a worker
      mid-job fails on a column that vanished
      underneath it.


EXPAND AND CONTRACT

  Split one breaking change into several SAFE deploys:

    1  EXPAND     add full_name, KEEP name
    2  DEPLOY     code writes both, reads full_name
                  with a fallback
    3  MIGRATE    backfill name → full_name
    4  CONTRACT   a later deploy removes name

  At EVERY point, both old and new code work.

  That property is what makes zero-downtime deploys
  possible at all.

  The cost is honest: four deploys instead of one,
  across days. People skip it because it feels like
  ceremony — then discover why it exists during an
  incident.


Three rules from the same principle

  Every migration must be safe against the code
  CURRENTLY RUNNING

    ✅ always safe
         add a NULLABLE column
         add a new table
         add an index (concurrently)

    ❌ never safe in one step
         drop a column
         rename a column
         add NOT NULL with no default
         change a column type

  Separate SCHEMA changes from DATA changes

    a migration backfilling a million rows holds a
    transaction open — and on MySQL a long ALTER can
    lock the table while your deploy waits

      backfill in a chunked command or queued job,
      NOT in the migration

  A migration must be reversible IN PRACTICE

    down() that drops a column you spent a day
    backfilling is not a rollback — it is a second
    outage

    ⚠️  The real rollback for a bad deploy is
        DEPLOYING THE PREVIOUS CODE.

        Which only works if the schema still supports
        it — exactly what expand-contract guarantees.`,
      codeExample: {
        title: "Renaming a column without an outage",
        code: `<?php
// ---------- ❌ The one-step rename ----------

Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('name', 'full_name');
});

// Deploy it and every server still running the old code
// 500s on SELECT name. So does every queue worker. So
// does the job that was mid-flight.


// ==========================================================
// DEPLOY 1 — EXPAND. Add, never remove.
// ==========================================================

Schema::table('users', function (Blueprint $table) {
    $table->string('full_name')->nullable();     // nullable = always safe
});

// Old code: untouched, still reads name.
// New code: not deployed yet.


// ==========================================================
// DEPLOY 2 — code that understands BOTH
// ==========================================================

<?php

class User extends Model
{
    // Read the new column, fall back to the old
    public function getDisplayNameAttribute(): string
    {
        return $this->full_name ?? $this->name;
    }

    // Write both, so rows created now are correct either way
    public function setDisplayNameAttribute(string $value): void
    {
        $this->attributes['full_name'] = $value;
        $this->attributes['name']      = $value;
    }
}

// Now old servers and new servers both work. That is the
// property the whole technique exists for.


// ==========================================================
// DEPLOY 3 — backfill, in a COMMAND, not a migration
// ==========================================================

<?php

class BackfillFullNames extends Command
{
    protected $signature = 'users:backfill-full-name';

    public function handle(): int
    {
        $bar = $this->output->createProgressBar(
            User::whereNull('full_name')->count()
        );

        User::whereNull('full_name')
            ->chunkById(500, function ($users) use ($bar) {
                foreach ($users as $user) {
                    $user->updateQuietly(['full_name' => $user->name]);
                    $bar->advance();
                }
            });

        $bar->finish();

        return self::SUCCESS;
    }
}

// A migration doing this holds a transaction open across a
// million rows, and your deploy waits behind it.


// ==========================================================
// DEPLOY 4 — CONTRACT. Days later, once nothing reads it.
// ==========================================================

<?php

// First: prove nothing reads it. Log any access for a week.
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('name');
});

// And remove the accessor/mutator in the same release.


<?php
// ---------- Safe vs unsafe, as a checklist ----------

// ✅ Safe against running code
$table->string('nickname')->nullable();
$table->index(['team_id', 'status']);           // concurrently on PG
Schema::create('audit_logs', ...);

// ❌ Unsafe in one step — needs expand-contract
$table->dropColumn('name');
$table->renameColumn('name', 'full_name');
$table->string('email')->nullable(false);       // existing NULLs fail
$table->integer('total')->change();             // type change, table lock


# ---------- The commands worth knowing ----------

php artisan migrate --force
php artisan migrate --pretend        # print the SQL, run nothing
php artisan migrate:status           # what has and has not run

# ⚠️ NOT a production rollback strategy:
php artisan migrate:rollback
#
# down() dropping a column you spent a day backfilling is
# a second outage. The real rollback is deploying the
# PREVIOUS CODE — which only works if the schema still
# supports it.`,
      },
      keyTakeaways: [
        "<b>Schema changes are part of the release</b>: new code plus new schema is the new version.",
        "<b>`--force` exists because CI cannot answer the production confirmation prompt.</b>",
        "<b>During a deploy, two versions of your code run at once.</b>",
        "<b>A renamed column breaks every server still running the old code</b>, and half your traffic errors.",
        "<b>Queue workers hit the same problem</b>, including jobs already in flight.",
        "<b>Expand-contract splits one breaking change into several safe deploys.</b>",
        "<b>Expand, deploy dual-reading code, backfill, then contract later.</b>",
        "<b>At every step both old and new code work</b>, which is the entire property.",
        "<b>Adding a nullable column is always safe</b>; dropping, renaming or adding `NOT NULL` never is.",
        "<b>Separate schema changes from data changes</b>: backfill in a chunked command, not a migration.",
        "<b>A long migration holds a transaction open</b> and can lock the table while the deploy waits.",
        "<b>The real rollback is deploying the previous code</b>, which requires the schema to still support it.",
      ],
      commonMistakes: [
        "<b>Renaming a column in one migration.</b> Every server on the old code starts erroring.",
        "<b>Adding a `NOT NULL` column with no default.</b> Existing rows fail the constraint immediately.",
        "<b>Backfilling inside a migration.</b> The transaction holds, the table locks, the deploy hangs.",
        "<b>Relying on `migrate:rollback` in production.</b> Dropping a backfilled column is a second outage.",
        "<b>Forgetting workers when reasoning about versions.</b> They run old code long after the deploy.",
        "<b>Contracting too early.</b> Something still read that column, and now it 500s.",
      ],
      quiz: [
        {
          question: "Why is renaming a column in one migration dangerous?",
          options: [
            "It is slow",
            "Both code versions run during a deploy, so servers on the old code query a column that no longer exists",
            "Renames are not supported",
            "It loses data",
          ],
          correctIndex: 1,
          explanation: "Queue workers on old code hit the same failure.",
        },
        {
          question: "What are the four steps of expand-contract?",
          options: [
            "Backup, migrate, deploy, verify",
            "Expand the schema, deploy dual-reading code, backfill the data, contract later",
            "Deploy, migrate, rollback, retry",
            "Test, build, deploy, monitor",
          ],
          correctIndex: 1,
          explanation: "At every step both old and new code work.",
        },
        {
          question: "Why backfill in a command rather than a migration?",
          options: [
            "Migrations cannot update data",
            "A migration holds a transaction open across every row and can lock the table while the deploy waits",
            "Commands are faster",
            "It is a style preference",
          ],
          correctIndex: 1,
          explanation: "Chunk it, and keep schema changes separate from data changes.",
        },
        {
          question: "What is the real rollback strategy for a bad deploy?",
          options: [
            "`migrate:rollback`",
            "Deploying the previous code, which requires the schema to still support it",
            "Restoring a backup",
            "Maintenance mode",
          ],
          correctIndex: 1,
          explanation: "Expand-contract is what guarantees the old code still runs.",
        },
      ],
    },
    {
      id: "platforms",
      title: "Cloud, Forge & Vapor",
      durationMinutes: 11,
      explanation: "Three first-party paths, solving three different problems.\n\n---\n\n### 1. Basic — the three\n\n<b>Laravel Cloud</b> is a managed application platform:\n\n```text\nyou → Laravel Cloud → managed infrastructure → your application\n```\n\nYou focus on code, environment and deploys rather than configuring servers.\n\n<b>Laravel Forge</b> manages servers you own:\n\n```text\nyour AWS / DigitalOcean account → server → Forge → your application\n```\n\nForge provisions and configures; the server, the bill and the responsibility are yours.\n\n<b>Laravel Vapor</b> is serverless on AWS:\n\n```text\nLaravel → Vapor → AWS serverless\n```\n\nYou stop asking which server is running Laravel.\n\n---\n\n### 2. Intermediate — the mental models\n\n```text\nCloud   a managed Laravel platform\nForge   manage your own servers\nVapor   serverless Laravel on AWS\n```\n\n<b>None is universally best.</b> The choice comes from team expertise, control, cost, scaling, infrastructure requirements and operational complexity.\n\n<b>The most useful axis is where the responsibility sits.</b> Forge gives you the most control and hands you everything that comes with it: OS updates, disk space, security patches, the 3am reboot. Cloud takes most of that away and takes some control with it. <b>Both are valid; pretending the responsibility disappears is not.</b>\n\n---\n\n### 3. Advanced — what actually decides it\n\n<b>Serverless is not a hosting choice, it is an architecture choice.</b> Vapor removes servers and changes the rules:\n\n```text\nno local filesystem you can rely on   → everything goes to S3\nexecution time limits                 → long jobs must be split\ncold starts                           → first request after idle is slow\ndatabase connections                  → many short-lived functions exhaust a pool\n```\n\nAn application written assuming a persistent local disk and unlimited execution time does not simply move to Vapor. <b>It gets rewritten to move to Vapor</b>, which is fine if you know that going in and a nasty surprise if you do not.\n\n<b>The honest test for Forge is whether somebody owns the server.</b> Not \"can we manage it\", but is there a named person who patches it, watches the disk and gets woken at 3am? <b>A server nobody owns is the single most common source of production incidents</b>, because it works fine right up until it does not.\n\n<b>And cost inverts with traffic.</b> Serverless is cheap when traffic is spiky or low and expensive when it is constant and high; a fixed server is the reverse. So the question is not \"which is cheaper\" but <b>\"cheaper at what traffic shape\"</b>, and the answer changes as you grow.\n\nOne last practical point: <b>everything in this elective still applies on every platform.</b> A managed platform runs your workers and scheduler for you, but you still have to configure them, and \"it is managed\" has never once meant nobody had to think about backups.",
      diagram: `The three

  LARAVEL CLOUD — a managed platform

    you → Laravel Cloud
        → managed infrastructure
        → your application

    focus on code, environment and deploys

  LARAVEL FORGE — servers you own

    your AWS / DigitalOcean account
        → server → Forge → your application

    Forge provisions and configures.
    The server, the bill and the responsibility are
    YOURS.

  LARAVEL VAPOR — serverless on AWS

    Laravel → Vapor → AWS serverless

    you stop asking which server runs Laravel


The mental models

    Cloud   a managed Laravel platform
    Forge   manage your own servers
    Vapor   serverless Laravel on AWS

  None is universally best. It comes from team
  expertise · control · cost · scaling ·
  infrastructure requirements · operational
  complexity.

  The most useful axis: WHERE THE RESPONSIBILITY
  SITS.

    Forge   most control — and OS updates, disk
            space, security patches, the 3am reboot
    Cloud   takes most of that away, and some
            control with it

  Both valid. Pretending the responsibility
  disappears is not.


  ⚠️  SERVERLESS IS AN ARCHITECTURE CHOICE, NOT A
      HOSTING CHOICE.

      Vapor removes servers and changes the rules:

        no reliable local filesystem
          → everything goes to S3
        execution time limits
          → long jobs must be split
        cold starts
          → first request after idle is slow
        database connections
          → many short-lived functions exhaust a pool

      An app assuming a persistent disk and unlimited
      execution time does not MOVE to Vapor. It gets
      REWRITTEN to move to Vapor.

      Fine if you know going in. Nasty if you do not.


  The honest test for Forge

    not "can we manage a server"
    but "is there a NAMED PERSON who patches it,
        watches the disk, and gets woken at 3am?"

    A server nobody owns is the most common source of
    production incidents — it works fine right up
    until it does not.


  Cost inverts with traffic

    serverless    cheap when spiky or low
                  expensive when constant and high
    fixed server  the reverse

    So: not "which is cheaper" but CHEAPER AT WHAT
    TRAFFIC SHAPE — and the answer changes as you
    grow.


  And everything in this elective still applies on
  every platform. A managed platform runs your
  workers and scheduler — you still configure them,
  and "it is managed" has never meant nobody thinks
  about backups.`,
      codeExample: {
        title: "What each platform changes about your code",
        code: `# ---------- Forge: you own a server ----------

# Forge provisions nginx, PHP-FPM, MySQL, Redis,
# certificates, and a deploy script.
#
# You own:
#   OS updates          unattended-upgrades
#   disk space          the classic 3am failure
#   security patches
#   backups
#   the pager
#
# The test is not "can we manage it" but
# "who is the named person?"


# ---------- Cloud: managed ----------

# You configure the application, environment and
# processes. Infrastructure is somebody else's job.
#
# You still configure:
#   worker processes and counts
#   the scheduler
#   environment variables
#   backup retention
#
# "It is managed" has never meant nobody thinks about
# backups.


<?php
// ---------- ⚠️ Vapor changes your CODE ----------

// 1. No reliable local filesystem
// ❌
Storage::disk('local')->put("invoices/{$id}.pdf", $pdf);
$path = storage_path('app/exports/report.csv');

// ✅
Storage::disk('s3')->put("invoices/{$id}.pdf", $pdf);

// FILESYSTEM_DISK=s3 everywhere, including temp files


// 2. Execution time limits
// ❌ A job that takes eleven minutes
class GenerateAnnualReport implements ShouldQueue
{
    public $timeout = 900;
}

// ✅ Split it
Bus::batch(
    $teams->map(fn ($team) => new GenerateTeamReport($team))
)->then(fn () => new CombineReports())->dispatch();


// 3. Cold starts
// The first request after idle pays framework boot.
// Which is where Day 33's config/route/view caches stop
// being an optimisation and become a requirement.


// 4. Database connections
// Many short-lived functions each open a connection and
// exhaust the pool. RDS Proxy exists for exactly this.


<?php
// ---------- Written portably, it runs anywhere ----------

// ❌ Assumes a server
$pdf = storage_path("app/invoices/{$invoice->id}.pdf");
exec("wkhtmltopdf {$html} {$pdf}");
Mail::to($user)->send(new InvoiceMail($invoice, $pdf));

// ✅ Runs on Forge, Cloud or Vapor unchanged
$pdf = $this->pdfService->render($invoice);      // no local path assumed
Storage::disk('invoices')->put("{$invoice->id}.pdf", $pdf);
SendInvoiceEmail::dispatch($invoice);            // queued, bounded


# ---------- Cost, by traffic shape ----------

# Spiky / low traffic
#   serverless   pay per request        ✅
#   fixed server pay for idle capacity  ❌
#
# Constant / high traffic
#   serverless   pay per request, and there are many  ❌
#   fixed server amortised over everything            ✅
#
# The answer changes as you grow. Model it again then.


# ---------- Whichever you choose, these still exist ----------

# workers running        → layer 3
# scheduler invoked      → layer 3
# logs aggregated        → layer 5
# errors tracked         → layer 5
# backups, restored once → layer 4
#
# The platform changes WHO configures them, never
# WHETHER they are needed.`,
      },
      keyTakeaways: [
        "<b>Cloud is a managed Laravel platform; Forge manages servers you own; Vapor is serverless on AWS.</b>",
        "<b>None is universally best</b>: expertise, control, cost, scaling and operational complexity decide.",
        "<b>The useful axis is where responsibility sits</b>, and it never disappears entirely.",
        "<b>Forge gives the most control and hands you OS updates, disk space, patches and the pager.</b>",
        "<b>Serverless is an architecture choice, not a hosting choice.</b>",
        "<b>Vapor removes the reliable local filesystem</b>, so everything goes to S3.",
        "<b>Execution limits mean long jobs must be split</b>, and cold starts make boot caches a requirement.",
        "<b>Many short-lived functions can exhaust a database connection pool.</b>",
        "<b>An app assuming a local disk gets rewritten to move to Vapor</b>, not simply moved.",
        "<b>The test for Forge is whether a named person owns the server</b>, not whether the team could.",
        "<b>Cost inverts with traffic shape</b>: serverless suits spiky, fixed servers suit constant.",
        "<b>Workers, scheduler, logs, errors and backups exist on every platform.</b>",
      ],
      commonMistakes: [
        "<b>Choosing a platform on price alone.</b> Cost inverts depending on traffic shape.",
        "<b>Moving to Vapor without auditing filesystem use.</b> Local paths fail in ways that are hard to trace.",
        "<b>Assuming long jobs survive serverless.</b> Execution limits mean they need splitting.",
        "<b>Running Forge with no named owner for the server.</b> The disk fills and nobody is watching.",
        "<b>Thinking \"managed\" means backups are handled.</b> It changes who configures them, not whether they exist.",
      ],
      quiz: [
        {
          question: "What is the mental model for Forge?",
          options: [
            "A managed platform",
            "It manages servers you own, so the server, bill and responsibility stay yours",
            "Serverless on AWS",
            "A CI system",
          ],
          correctIndex: 1,
          explanation: "Including OS updates, disk space, patches and the pager.",
        },
        {
          question: "Why is Vapor an architecture choice rather than a hosting one?",
          options: [
            "It is AWS-only",
            "No reliable local filesystem, execution limits, cold starts and connection limits change your code",
            "It is more expensive",
            "It requires Docker",
          ],
          correctIndex: 1,
          explanation: "An app assuming a local disk gets rewritten to move there.",
        },
        {
          question: "What is the honest test for choosing Forge?",
          options: [
            "Whether the team knows Linux",
            "Whether a named person patches the server, watches the disk and gets woken at 3am",
            "Whether AWS is already in use",
            "Traffic volume",
          ],
          correctIndex: 1,
          explanation: "A server nobody owns is a common source of incidents.",
        },
        {
          question: "How does cost compare between serverless and fixed servers?",
          options: [
            "Serverless is always cheaper",
            "It inverts with traffic shape: serverless suits spiky and low, fixed suits constant and high",
            "Fixed is always cheaper",
            "They are the same",
          ],
          correctIndex: 1,
          explanation: "And the answer changes as you grow, so model it again.",
        },
      ],
    },
    {
      id: "docker-deployment",
      title: "Docker & multi-stage builds",
      durationMinutes: 11,
      explanation: "An explicit environment instead of a hopeful one.\n\n---\n\n### 1. Basic — what Docker gives you\n\n```text\ndeveloper machine → Docker image → production\n```\n\nInstead of:\n\n```text\n\"hopefully production has the same PHP version\"\n```\n\nyou write it down:\n\n```text\nPHP version · extensions · Composer · Node / build tools · system dependencies\n```\n\n<b>The value is that the environment is code</b>, reviewed in a pull request like everything else, rather than a set of decisions somebody made on a server two years ago and did not record.\n\n---\n\n### 2. Intermediate — multi-stage builds\n\nA naive image contains everything you needed to build it:\n\n```text\nPHP · Composer · Node · npm · dev dependencies · build tools · source\n```\n\nA multi-stage build separates the two:\n\n```text\n        docker build\n   ┌─────────┴─────────┐\nbuild stage       production stage\nNode, npm         PHP runtime\nComposer          Laravel\nassets            production deps\n   └──── artifacts ────→\n```\n\n```text\ninstall and compile → copy only what runtime needs\n```\n\n<b>The image gets smaller</b>, which speeds deploys, and <b>it gets safer</b>, which matters more: an image with no Composer, no npm and no source-map-producing toolchain is an image with far less for an attacker to work with. Same argument as `--no-dev`, one level down.\n\n---\n\n### 3. Advanced — what people get wrong\n\n<b>Do not put secrets in the image.</b> A build argument, a copied `.env`, a hardcoded key: all of them are baked into a layer, and layers are readable by anybody who can pull the image. <b>Secrets are injected at runtime, always.</b>\n\n<b>An image is per commit, not per environment.</b> Build once, tag it with the commit, and run <b>the same image</b> in staging and production with different environment variables. Building separately per environment means you tested something you did not ship.\n\n<b>And a container is one process.</b> Your web container should not also run the queue worker and cron, because then a worker crash takes your web tier with it and you cannot scale the two independently:\n\n```text\nweb container       php-fpm / FrankenPHP\nworker container    queue:work\nscheduler container schedule:work\n```\n\n<b>Same image, three commands.</b> Which is exactly Day 34's layer 3, made explicit.\n\n<b>Two more traps.</b> Docker's layer cache means <b>copying your whole source before `composer install` reinstalls dependencies on every code change</b>: copy `composer.json` and `composer.lock` first. And <b>logs must go to stdout</b>, not to a file inside the container, because that file dies with the container and takes your only evidence with it.",
      diagram: `What Docker gives you

    developer machine → Docker image → production

  Instead of:

    "hopefully production has the same PHP version"

  You write it down:

    PHP version · extensions · Composer
    Node / build tools · system dependencies

  The value: THE ENVIRONMENT IS CODE, reviewed in a
  PR — rather than decisions somebody made on a
  server two years ago and did not record.


Multi-stage builds

  A naive image contains everything you needed to
  BUILD it:

    PHP · Composer · Node · npm · dev dependencies
    build tools · source

  Multi-stage separates them:

                 docker build
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
       build stage        production stage
       Node / npm          PHP runtime
       Composer            Laravel
       assets              production deps
            │
            └──── artifacts ────→

    install and compile → copy only what RUNTIME needs

  Smaller (faster deploys) and SAFER (which matters
  more): no Composer, no npm, no toolchain is far
  less for an attacker to work with.

  Same argument as --no-dev, one level down.


What people get wrong

  ⚠️  NEVER put secrets in the image.

      a build arg · a copied .env · a hardcoded key

      All baked into a LAYER — and layers are
      readable by anyone who can pull the image.

        secrets are injected at RUNTIME, always

  ⚠️  An image is per COMMIT, not per ENVIRONMENT.

      build once → tag with the commit
      run THE SAME IMAGE in staging and production
      with different env vars

      Building per environment means you tested
      something you did not ship.

  ⚠️  A container is ONE PROCESS.

      web container        php-fpm / FrankenPHP
      worker container     queue:work
      scheduler container  schedule:work

      Same image, three commands.

      Put all three in one and a worker crash takes
      your web tier with it — and you cannot scale
      them independently.

      This is layer 3, made explicit.

  ⚠️  Layer cache: copy composer.json and
      composer.lock BEFORE the source, or every code
      change reinstalls every dependency.

  ⚠️  Logs go to STDOUT, not a file inside the
      container — that file dies with the container
      and takes your evidence with it.`,
      codeExample: {
        title: "A multi-stage Dockerfile, and three containers from one image",
        code: `# ---------- Stage 1: frontend assets ----------
FROM node:22-alpine AS assets

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                             # cached unless these two change
COPY resources/ resources/
COPY vite.config.js ./
RUN npm run build


# ---------- Stage 2: PHP dependencies ----------
FROM composer:2 AS vendor

WORKDIR /app
# composer.json/lock FIRST, so a code change does not
# reinstall every dependency
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-dev


# ---------- Stage 3: runtime. Only what running needs. ----------
FROM php:8.4-fpm-alpine AS production

RUN apk add --no-cache postgresql-dev icu-dev \\
    && docker-php-ext-install pdo_pgsql opcache intl bcmath

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/

WORKDIR /var/www

COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build
COPY . .

# No Composer. No npm. No build toolchain. No dev
# dependencies. Far less for an attacker to work with.

RUN chown -R www-data:www-data storage bootstrap/cache

# ⚠️ No secrets here. Not as ARG, not as a copied .env.
#    Layers are readable by anyone who can pull the image.

CMD ["php-fpm"]


# ---------- One image, three processes ----------

# docker-compose.yml
services:
  web:
    image: invoicehub:\${GIT_SHA}
    command: php-fpm
    environment: [APP_ENV, DB_HOST, REDIS_HOST]

  worker:
    image: invoicehub:\${GIT_SHA}         # ← the same image
    command: php artisan queue:work redis --tries=3 --max-time=3600
    deploy: { replicas: 4 }

  scheduler:
    image: invoicehub:\${GIT_SHA}         # ← the same image
    command: php artisan schedule:work

# A container is one process. All three in one and a
# worker crash takes your web tier down — and you cannot
# scale them separately.


# ---------- Build once, run everywhere ----------

docker build -t invoicehub:\${GIT_SHA} .
docker push registry/invoicehub:\${GIT_SHA}

# staging     runs invoicehub:abc123 with staging env vars
# production  runs invoicehub:abc123 with production env vars
#
# The SAME image. Build per environment and you tested
# something you did not ship.


# ---------- Secrets at runtime ----------

# ❌ Baked into a layer, forever
ARG STRIPE_SECRET
ENV STRIPE_SECRET=\${STRIPE_SECRET}
COPY .env .env

# ✅ Injected when it runs
docker run --env-file /etc/invoicehub/production.env invoicehub:abc123


<?php
// ---------- Logs to stdout ----------

// config/logging.php
'default' => env('LOG_CHANNEL', 'stderr'),

'channels' => [
    'stderr' => [
        'driver'    => 'monolog',
        'handler'   => StreamHandler::class,
        'with'      => ['stream' => 'php://stderr'],
        'formatter' => JsonFormatter::class,      // for log aggregation
    ],
],

// A log file inside the container dies with the
// container, taking your only evidence with it.`,
      },
      keyTakeaways: [
        "<b>Docker makes the environment explicit and reviewable</b> instead of a set of undocumented server decisions.",
        "<b>A naive image ships everything you needed to build it</b>: Composer, npm, dev dependencies, toolchain.",
        "<b>A multi-stage build compiles in one stage and copies only artifacts into the runtime stage.</b>",
        "<b>Smaller images deploy faster, and safer images matter more</b>: less for an attacker to work with.",
        "<b>Never put secrets in an image.</b> Layers are readable by anybody who can pull it.",
        "<b>Secrets are injected at runtime, always.</b>",
        "<b>An image is per commit, not per environment</b>: run the same image everywhere with different variables.",
        "<b>Building per environment means you tested something you did not ship.</b>",
        "<b>A container is one process</b>: separate web, worker and scheduler containers from one image.",
        "<b>Combining them means a worker crash takes down your web tier</b> and you cannot scale independently.",
        "<b>Copy `composer.json` and `composer.lock` before the source</b>, or every code change reinstalls everything.",
        "<b>Logs go to stdout</b>, because a file inside the container dies with it.",
      ],
      commonMistakes: [
        "<b>Copying `.env` into the image.</b> The secret is in a layer anybody who pulls it can read.",
        "<b>Building a different image per environment.</b> You shipped something you never tested.",
        "<b>Running web, worker and cron in one container.</b> One crash takes everything and nothing scales.",
        "<b>Copying source before `composer install`.</b> Every code change invalidates the dependency layer.",
        "<b>Writing logs to a file in the container.</b> The evidence dies with the container.",
        "<b>Shipping the build toolchain to production.</b> Same mistake as installing dev dependencies.",
      ],
      quiz: [
        {
          question: "What does a multi-stage build achieve?",
          options: [
            "Faster builds only",
            "The runtime image contains only what running needs, not Composer, npm or the toolchain",
            "Automatic secrets",
            "Multiple environments",
          ],
          correctIndex: 1,
          explanation: "Smaller and safer, which is the same argument as `--no-dev`.",
        },
        {
          question: "Why must secrets never go in an image?",
          options: [
            "They increase size",
            "They are baked into a layer, and layers are readable by anybody who can pull the image",
            "Docker strips them",
            "They expire",
          ],
          correctIndex: 1,
          explanation: "Inject them at runtime instead.",
        },
        {
          question: "Why build one image and run it in every environment?",
          options: [
            "To save build time",
            "Building per environment means you tested something you did not ship",
            "Docker requires it",
            "For smaller images",
          ],
          correctIndex: 1,
          explanation: "Same image, different environment variables.",
        },
        {
          question: "Why separate web, worker and scheduler containers?",
          options: [
            "For smaller images",
            "A container is one process: combined, a worker crash takes the web tier and nothing scales independently",
            "Docker cannot run two processes",
            "For logging",
          ],
          correctIndex: 1,
          explanation: "Same image, three different commands.",
        },
      ],
    },
    {
      id: "zero-downtime-and-atomic-releases",
      title: "Zero downtime, atomic releases & maintenance mode",
      durationMinutes: 12,
      explanation: "How to replace a running application without anybody noticing.\n\n---\n\n### 1. Basic — the naive deploy\n\n```text\nstop A → deploy B → start B\n```\n\nUsers get:\n\n```text\n💥 downtime\n```\n\nAnd it is worse than the outage window suggests, because <b>the site is also broken during the deploy itself</b>: half the files are the new version and half are the old, so a request landing mid-`git pull` gets an application that has never existed.\n\nWhat you want:\n\n```text\nversion A serving users\n  → build version B\n  → health checks\n  → switch traffic\n  → version B\n```\n\n---\n\n### 2. Intermediate — atomic releases\n\nBuild the release somewhere else entirely, then move a symlink:\n\n```text\n/releases/\n   2026-09-02-001\n   2026-09-02-002\n   2026-09-02-003\n/current → 2026-09-02-003\n```\n\n```text\nbuild the new release → prepare it → point current at it\n```\n\n<b>The switch is one symlink update, which is atomic.</b> There is no moment where half the application is new: requests see release 002 or release 003, never a mixture.\n\nAnd rollback becomes trivial:\n\n```text\ncurrent → the previous release\n```\n\n<b>That is the real prize.</b> A rollback that takes one second and no build is a rollback you will actually use at 3am, rather than debugging live because redeploying feels too slow.\n\nThe pieces that must be <b>shared</b> across releases rather than copied: `.env`, `storage/`, and anything users uploaded. Symlink those in, or every deploy loses your files.\n\n---\n\n### 3. Advanced — maintenance mode, and its trap\n\n```bash\nphp artisan down --render=\"errors::503\"\nphp artisan up\n```\n\n<b>Maintenance mode is for work that genuinely requires unavailability</b>, and mature deployments prefer zero downtime instead.\n\nA <b>secret bypass</b> lets you verify a deploy while everyone else sees the maintenance page:\n\n```text\nnormal user → maintenance page\nsecret URL  → the application\n```\n\n<b>Treat the secret as sensitive.</b> It is an authentication bypass with a friendly name, and one pasted into a group chat is now shared with everybody in it.\n\n<b>And the trap that catches people:</b> `php artisan down` writes a file that `php artisan up` deletes, so <b>if your deploy fails between the two, the site stays down until somebody notices and runs `up` by hand.</b> A failing script plus a naive `set -e` gives you exactly that.\n\n```text\ndown → deploy fails → the script exits → still down\n```\n\nUse a trap that always runs `up`, or use atomic releases and skip maintenance mode entirely.\n\n<b>One last piece: health checks must check more than the homepage.</b> A check that only confirms a 200 will happily promote a release whose database credentials are wrong, because the homepage is cached. <b>Check the database, the cache and the queue before you switch traffic</b>, or the switch is a guess.",
      diagram: `The naive deploy

    stop A → deploy B → start B

         💥 downtime

  Worse than the window suggests: the site is broken
  DURING the deploy too — half the files are new, half
  old, and a request landing mid-git-pull gets an
  application that has never existed.

  What you want:

    version A serving users
        ↓
    build version B
        ↓
    health checks
        ↓
    switch traffic
        ↓
    version B


Atomic releases

    /releases/
       2026-09-02-001
       2026-09-02-002
       2026-09-02-003
    /current → 2026-09-02-003

    build the new release → prepare it
                          → point current at it

  The switch is ONE SYMLINK UPDATE, which is atomic.

    no moment where half the app is new
    requests see 002 or 003, never a mixture

  And rollback:

    current → the previous release

  ⚠️  THAT IS THE REAL PRIZE.

      A rollback that takes one second and no build is
      a rollback you will actually USE at 3am — rather
      than debugging live because redeploying feels
      too slow.

  Shared across releases, never copied:

    .env · storage/ · user uploads

    symlink them in, or every deploy loses your files


Maintenance mode

    php artisan down --render="errors::503"
    php artisan up

  For work that GENUINELY requires unavailability.
  Mature deployments prefer zero downtime instead.

  Secret bypass:

    normal user → maintenance page
    secret URL  → the application

  ⚠️  Treat the secret as sensitive. It is an
      authentication bypass with a friendly name, and
      one pasted into a group chat is shared with
      everybody in it.


  ⚠️  THE TRAP

      down writes a file. up deletes it.

      If your deploy fails between the two, THE SITE
      STAYS DOWN until somebody notices and runs up
      by hand.

        down → deploy fails → script exits → still down

      A failing script plus a naive set -e gives you
      exactly that.

      Use a trap that always runs up — or use atomic
      releases and skip maintenance mode entirely.


  Health checks must check MORE THAN THE HOMEPAGE.

    a 200-only check will happily promote a release
    whose database credentials are wrong, because the
    homepage is cached

    check database + cache + queue before switching,
    or the switch is a guess.`,
      codeExample: {
        title: "Atomic releases, and maintenance mode that cannot strand you",
        code: `#!/usr/bin/env bash
set -euo pipefail

APP=/var/www/invoicehub
RELEASE="\${APP}/releases/\$(date +%Y%m%d%H%M%S)"

# ---------- 1. Build the new release elsewhere ----------
mkdir -p "\$RELEASE"
git clone --depth 1 --branch main git@github.com:acme/invoicehub.git "\$RELEASE"

cd "\$RELEASE"
composer install --no-dev --optimize-autoloader --no-interaction
npm ci && npm run build

# ---------- 2. Share what must survive a deploy ----------
ln -sfn "\${APP}/shared/.env"    "\${RELEASE}/.env"
rm -rf "\${RELEASE}/storage"
ln -sfn "\${APP}/shared/storage" "\${RELEASE}/storage"

# Copy these and every deploy loses your uploads.

# ---------- 3. Prepare it, while the OLD release serves ----------
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ---------- 4. Prove it before promoting it ----------
php artisan about > /dev/null
php -r "require 'vendor/autoload.php';" 

# ---------- 5. The switch: one atomic symlink ----------
ln -sfn "\$RELEASE" "\${APP}/current"
sudo systemctl reload php8.4-fpm

# No moment where half the app is new. Requests see the
# old release or the new one, never a mixture.

# ---------- 6. Processes ----------
php artisan queue:restart

# ---------- 7. Verify, and keep the last five ----------
curl -fsS https://invoicehub.com/health | grep -q '"database":"ok"'

ls -1dt "\${APP}"/releases/* | tail -n +6 | xargs rm -rf


# ---------- Rollback: one second, no build ----------

ln -sfn "\${APP}/releases/20260902100000" "\${APP}/current"
sudo systemctl reload php8.4-fpm
php artisan queue:restart

# This is the real prize. A rollback this cheap is one
# you will actually use at 3am, instead of debugging
# live because redeploying feels too slow.


# ---------- ⚠️ Maintenance mode that cannot strand you ----------

# ❌ Deploy fails between these two lines and the site
#    stays down until a human notices
php artisan down
./deploy.sh              # fails, script exits
php artisan up           # never runs

# ✅ Always come back up, whatever happens
set -euo pipefail
trap 'php artisan up' EXIT

php artisan down --render="errors::503" --retry=60
./deploy.sh


<?php
// ---------- The secret bypass ----------

php artisan down --secret="a-long-random-string-nobody-guesses"

// Visit https://invoicehub.com/a-long-random-string...
// once, and your browser is let through while everyone
// else sees the maintenance page.
//
// ⚠️ It is an authentication bypass with a friendly
//    name. One pasted into a group chat is shared with
//    everybody in it. Generate a new one each deploy.

php artisan down --secret=$(openssl rand -hex 32)


<?php
// ---------- A health check worth gating a deploy on ----------

// ❌ Promotes a release whose DB credentials are wrong,
//    because the homepage is cached
curl -fsS https://invoicehub.com/ > /dev/null

// ✅
Route::get('/health', function () {
    return response()->json([
        'database' => rescue(fn () => DB::select('select 1') && 'ok', 'failing'),
        'cache'    => rescue(fn () => Cache::put('h', 1, 10) && 'ok', 'failing'),
        'queue'    => rescue(fn () => Queue::size() !== null ? 'ok' : 'failing', 'failing'),
        'release'  => config('app.release'),
    ]);
});

// curl -fsS .../health | grep -q '"database":"ok"'
//
// Without it, the traffic switch is a guess.`,
      },
      keyTakeaways: [
        "<b>Stop, deploy, start gives downtime</b>, and the site is broken mid-deploy as files are replaced.",
        "<b>A request landing mid-`git pull` gets an application that never existed.</b>",
        "<b>Atomic releases build in a new directory and switch a symlink</b>, which is instantaneous.",
        "<b>There is no moment where half the application is new.</b>",
        "<b>Rollback becomes one symlink change</b>, with no rebuild.",
        "<b>That cheap rollback is the real prize</b>, because you will actually use it at 3am.",
        "<b>`.env`, `storage/` and uploads must be shared, not copied</b>, or every deploy loses files.",
        "<b>Maintenance mode is for work that genuinely requires unavailability.</b>",
        "<b>The secret bypass is an authentication bypass</b>, so treat it as sensitive and rotate it.",
        "<b>If a deploy fails between `down` and `up`, the site stays down</b> until somebody notices.",
        "<b>Use a trap that always runs `up`</b>, or use atomic releases and skip maintenance mode.",
        "<b>Health checks must test database, cache and queue</b>, or the traffic switch is a guess.",
      ],
      commonMistakes: [
        "<b>Deploying by pulling into the live directory.</b> The site is broken while files are replaced.",
        "<b>Copying `storage/` into each release.</b> Every deploy loses user uploads.",
        "<b>`down` without a trap.</b> A failed deploy leaves the site in maintenance mode indefinitely.",
        "<b>Sharing the maintenance secret in chat.</b> It is a bypass, and now everybody has it.",
        "<b>Health checks that only fetch the homepage.</b> A cached page hides broken credentials.",
        "<b>Keeping no previous releases.</b> You have removed the rollback you were counting on.",
      ],
      quiz: [
        {
          question: "Why is deploying into the live directory worse than the downtime window suggests?",
          options: [
            "It is slower",
            "The site is broken during the deploy: half new files, half old, an application that never existed",
            "Permissions break",
            "Git is slow",
          ],
          correctIndex: 1,
          explanation: "Atomic releases make the switch instantaneous instead.",
        },
        {
          question: "What is the real prize of atomic releases?",
          options: [
            "Faster deploys",
            "A rollback that is one symlink and no rebuild, which you will actually use under pressure",
            "Smaller disk usage",
            "Simpler scripts",
          ],
          correctIndex: 1,
          explanation: "Otherwise people debug live because redeploying feels too slow.",
        },
        {
          question: "What happens if a deploy fails between `down` and `up`?",
          options: [
            "Laravel recovers automatically",
            "The site stays in maintenance mode until somebody notices and runs `up` by hand",
            "The deploy retries",
            "Nothing",
          ],
          correctIndex: 1,
          explanation: "A trap that always runs `up` prevents it.",
        },
        {
          question: "Why must a health check test more than the homepage?",
          options: [
            "For completeness",
            "A cached homepage returns 200 even when database credentials are wrong, so the switch is a guess",
            "For monitoring",
            "It does not need to",
          ],
          correctIndex: 1,
          explanation: "Check database, cache and queue before promoting.",
        },
      ],
    },
    {
      id: "workers-and-scheduler",
      title: "Queue workers, Supervisor & the scheduler",
      durationMinutes: 12,
      explanation: "Layer 3, in detail. This is the part of the deploy that fails silently.\n\n---\n\n### 1. Basic — a worker must exist\n\n```text\nweb request → dispatch job → queue → worker → handle()\n```\n\nWithout a worker running:\n\n```text\ndispatch()  succeeds\njob         never processed\n```\n\n<b>Nothing errors.</b> The controller returns 200, Redis holds the job, and the email is simply never sent. This is the single most common \"my deploy worked\" failure.\n\n---\n\n### 2. Intermediate — Supervisor\n\nWorkers crash. They run out of memory, hit an unexpected failure, or get killed:\n\n```text\nworker 💥 → 😴 → nobody notices\n```\n\nSupervisor watches and restarts them:\n\n```text\nworker dies → Supervisor notices → restart → worker running\n```\n\n<b>Which is not optional</b>, because a worker exiting is normal rather than exceptional: `--max-time` and `--max-jobs` make workers exit deliberately, so something must start them again.\n\nAnd the scheduler needs a trigger:\n\n```text\ncron (every minute) → Laravel scheduler → your scheduled tasks\n```\n\n<b>Laravel's scheduler does not run itself.</b> One cron entry calls `schedule:run` every minute, and Laravel decides which tasks are due. Miss that entry and every `Schedule::command(...)` you wrote does nothing, forever, silently.\n\n---\n\n### 3. Advanced — the parts that bite\n\n<b>Workers hold your code in memory.</b> A deploy that does not run `queue:restart` leaves workers running last week's code indefinitely, and the symptom is jobs behaving like the old version while the website behaves like the new one.\n\n<b>`queue:restart` is a signal, not a kill.</b> It tells workers to exit gracefully after the current job, and Supervisor starts fresh ones. So a worker mid-job finishes it, which is exactly what you want, and also means the restart is not instant.\n\n<b>Set `--max-time` or `--max-jobs`.</b> A worker running for weeks accumulates memory and stale state, and this is the queue version of the Octane problem from Day 33: long-lived processes make leaks matter. Recycling turns a slow leak into a non-event.\n\n<b>Give each queue its own workers.</b> One pool processing both `emails` and `reports` means an hour of report generation blocks every email behind it. Separate pools, sized separately.\n\n<b>And the scheduler needs its own protections</b>, all from Day 30: `withoutOverlapping()` with an explicit expiry, `onOneServer()` for multi-server setups, and a failure hook, because a scheduled command failing silently is a report nobody notices missing for a month.\n\n<b>The unifying point:</b> a worker and a scheduler are processes, and processes need monitoring. <b>Queue depth is the metric</b>: rising steadily means workers are dead or too few, and it is the earliest signal you will get.",
      diagram: `A worker must exist

    web request → dispatch job → queue → worker
                → handle()

  Without one:

    dispatch()   succeeds
    job          never processed

  ⚠️  NOTHING ERRORS. The controller returns 200,
      Redis holds the job, the email is never sent.

      The single most common "my deploy worked"
      failure.


Supervisor

  Workers crash — out of memory, unexpected failure,
  killed:

    worker 💥 → 😴 → nobody notices

  Supervisor watches:

    worker dies → Supervisor notices → restart
                → worker running

  Not optional: a worker EXITING IS NORMAL.
  --max-time and --max-jobs make workers exit
  deliberately, so something must start them again.


The scheduler needs a trigger

    cron (every minute)
        ↓
    Laravel scheduler
        ↓
    your scheduled tasks

  ⚠️  Laravel's scheduler DOES NOT RUN ITSELF.

      One cron entry calls schedule:run every minute;
      Laravel decides what is due.

      Miss it and every Schedule::command() you wrote
      does nothing. Forever. Silently.


The parts that bite

  Workers hold your CODE IN MEMORY

    no queue:restart → workers run last week's code
    indefinitely

    symptom: jobs behave like the old version while
    the website behaves like the new one

  queue:restart is a SIGNAL, not a kill

    workers exit gracefully AFTER the current job,
    and Supervisor starts fresh ones

    so a mid-job worker finishes — which is what you
    want, and also means it is not instant

  Set --max-time or --max-jobs

    a worker running for weeks accumulates memory and
    stale state

    the queue version of Day 33's Octane problem:
    long-lived processes make leaks matter

    recycling turns a slow leak into a non-event

  Give each queue its OWN workers

    one pool doing 'emails' and 'reports' means an
    hour of report generation blocks every email
    behind it

  The scheduler needs Day 30's protections

    withoutOverlapping() with an explicit expiry
    onOneServer() on multi-server setups
    a failure hook

    a scheduled command failing silently is a report
    nobody notices missing for a month


  THE UNIFYING POINT

    a worker and a scheduler are PROCESSES, and
    processes need MONITORING

    QUEUE DEPTH is the metric: rising steadily means
    workers are dead or too few, and it is the
    earliest signal you will get`,
      codeExample: {
        title: "Supervisor, cron, and the monitoring that catches a dead worker",
        code: `# ---------- /etc/supervisor/conf.d/invoicehub.conf ----------

# Separate pools per queue. One pool doing both means an
# hour of report generation blocks every email behind it.

[program:invoicehub-emails]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/invoicehub/current/artisan queue:work redis
    --queue=emails
    --tries=3
    --backoff=10,60,300
    --max-time=3600          ; recycle hourly — a long-lived
    --max-jobs=1000          ; process makes leaks matter
    --sleep=3
autostart=true
autorestart=true             ; ← the whole point of Supervisor
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/log/invoicehub/worker-emails.log
stopwaitsecs=3600            ; let a job finish before killing

[program:invoicehub-reports]
command=php /var/www/invoicehub/current/artisan queue:work redis
    --queue=reports --tries=1 --timeout=1800 --max-time=3600
numprocs=2
; ...

supervisorctl reread && supervisorctl update
supervisorctl status


# ---------- The one cron entry the scheduler needs ----------

* * * * * cd /var/www/invoicehub/current && php artisan schedule:run >> /dev/null 2>&1

# ⚠️ Laravel's scheduler does not run itself. Miss this
#    line and every Schedule::command() you wrote does
#    nothing, forever, silently.

# In a container, a scheduler container instead:
#   command: php artisan schedule:work


<?php
// ---------- routes/console.php, with Day 30's protections ----------

use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('reports:generate')
    ->dailyAt('02:00')
    ->withoutOverlapping(50)                  // ← minutes, not the 24h default
    ->onOneServer()                           // ← needs a shared cache
    ->pingOnFailure('https://healthchecks.io/ping/xxx/fail');

// The heartbeat that proves the scheduler is alive at all
Schedule::call(fn () => Cache::put('scheduler:heartbeat', now(), now()->addMinutes(10)))
    ->everyMinute();


# ---------- Deploy: workers hold old code ----------

php artisan queue:restart

# A signal, not a kill. Workers finish the current job,
# exit gracefully, and Supervisor starts fresh ones on
# the new code.
#
# Without it: jobs behave like last week while the
# website behaves like today.


<?php
// ---------- Monitoring: queue depth is the metric ----------

Schedule::call(function () {
    $depth = Queue::connection('redis')->size('emails');

    if ($depth > 1000) {
        // Rising steadily = workers dead or too few.
        // This is the earliest signal you will get.
        Notification::route('slack', config('services.slack.ops'))
            ->notify(new QueueBacklog('emails', $depth));
    }

    // And the scheduler proving it ran at all
    $beat = Cache::get('scheduler:heartbeat');

    if (! $beat || $beat->lt(now()->subMinutes(5))) {
        Log::critical('Scheduler heartbeat missing');
    }
})->everyFiveMinutes();

// Built in:
php artisan queue:monitor redis:emails --max=1000
php artisan queue:failed
php artisan queue:retry all


<?php
// ---------- Failed jobs need a human, not a table ----------

// app/Providers/AppServiceProvider.php
Queue::failing(function (JobFailed $event) {
    Log::error('Job failed', [
        'connection' => $event->connectionName,
        'job'        => $event->job->resolveName(),
        'exception'  => $event->exception->getMessage(),
    ]);
});

// Otherwise failed_jobs quietly fills up and nobody
// reads it until somebody asks where their invoice went.


# ---------- The check that catches all of it ----------

supervisorctl status              # are workers running?
crontab -l                        # is the scheduler triggered?
php artisan queue:monitor redis:emails --max=100
php artisan schedule:list         # is what you meant scheduled?`,
      },
      keyTakeaways: [
        "<b>Without a worker, `dispatch()` succeeds and the job is never processed</b>, with no error anywhere.",
        "<b>Supervisor restarts workers that crash</b>, and a worker exiting is normal, not exceptional.",
        "<b>`--max-time` and `--max-jobs` make workers exit deliberately</b>, so something must restart them.",
        "<b>Laravel's scheduler does not run itself</b>: one cron entry calls `schedule:run` every minute.",
        "<b>Miss that entry and every scheduled task does nothing, forever, silently.</b>",
        "<b>Workers hold your code in memory</b>, so a deploy without `queue:restart` runs last week's code.",
        "<b>`queue:restart` is a graceful signal</b>: workers finish the current job, then exit.",
        "<b>Recycle workers</b>, since long-lived processes make memory leaks matter, as with Octane.",
        "<b>Give each queue its own worker pool</b>, or slow jobs block fast ones behind them.",
        "<b>The scheduler needs `withoutOverlapping()`, `onOneServer()` and a failure hook.</b>",
        "<b>Workers and schedulers are processes, and processes need monitoring.</b>",
        "<b>Queue depth is the metric</b>: rising steadily means workers are dead or too few.",
      ],
      commonMistakes: [
        "<b>Deploying with no worker running.</b> Every queued email silently never sends.",
        "<b>No cron entry for `schedule:run`.</b> Every scheduled task you wrote does nothing.",
        "<b>Forgetting `queue:restart`.</b> Jobs run last week's code while the site runs today's.",
        "<b>One worker pool for every queue.</b> An hour-long report blocks all your emails.",
        "<b>Workers that never recycle.</b> Memory grows until the process is killed under load.",
        "<b>No queue-depth alert.</b> The earliest available signal goes unwatched.",
      ],
      quiz: [
        {
          question: "What happens when no worker is running?",
          options: [
            "`dispatch()` throws",
            "It succeeds, the job sits in the queue, and nothing errors anywhere",
            "The job runs inline",
            "Laravel warns you",
          ],
          correctIndex: 1,
          explanation: "The most common \"my deploy worked\" failure.",
        },
        {
          question: "Why is Supervisor not optional?",
          options: [
            "Laravel requires it",
            "Workers exit as normal behaviour, from crashes and from `--max-time`, so something must restart them",
            "It handles the scheduler",
            "It manages memory",
          ],
          correctIndex: 1,
          explanation: "A worker exiting is expected, not exceptional.",
        },
        {
          question: "Why does the scheduler need a cron entry?",
          options: [
            "For logging",
            "Laravel's scheduler does not run itself; cron calls `schedule:run` every minute",
            "To set the timezone",
            "It does not",
          ],
          correctIndex: 1,
          explanation: "Without it, every scheduled task silently never runs.",
        },
        {
          question: "Why give each queue its own worker pool?",
          options: [
            "For monitoring",
            "A shared pool lets an hour-long report block every quick email behind it",
            "Redis requires it",
            "For memory limits",
          ],
          correctIndex: 1,
          explanation: "Separate pools, sized separately.",
        },
      ],
    },
    {
      id: "secrets-cicd-logs-and-backups",
      title: "Secrets, CI/CD, logs, errors & backups",
      durationMinutes: 13,
      explanation: "Layer 5: the things that decide whether you can survive a bad day.\n\n---\n\n### 1. Basic — secrets\n\nConfiguration comes from the environment, never from code:\n\n```text\n❌ $password = 'my-production-password';\n✅ environment → Laravel config → application\n```\n\n```text\nAPP_ENV · APP_KEY · DB_HOST · DB_PASSWORD · REDIS_HOST · AWS_ACCESS_KEY_ID\n```\n\n<b>Never commit `.env`, API keys, database passwords, cloud credentials or AI provider keys.</b>\n\nAnd the rule people get wrong:\n\n> <b>Once a secret is exposed, rotate it.</b>\n\nDeleting it from the latest commit is not enough. <b>It is in the history, in every clone, in every fork, and quite possibly already scraped</b>, because bots watch public commits for exactly this. Removing the commit changes nothing about who already has the key.\n\n---\n\n### 2. Intermediate — CI/CD\n\n```text\npush → CI → tests → lint → build → deploy\n```\n\n```text\ndeveloper → git push → GitHub Actions\n   ├── tests\n   ├── Pint\n   └── build\n        ↓\n     deploy\n```\n\n<b>The point is the gate, not the automation.</b>\n\n```text\npush broken code → deploy → 💥\npush broken code → tests fail → deployment stops\n```\n\nA reasonable pipeline: checkout, PHP dependencies, frontend dependencies, Pint, tests, build assets, deploy, migrate, restart workers.\n\n> <b>Do not deploy code that has not passed your automated quality gates.</b>\n\n<b>And CI is also where deploys stop being a person's ritual.</b> A deploy that lives in somebody's terminal history is a deploy that goes wrong the week they are away, which is Day 30's Envoy argument arriving again.\n\n---\n\n### 3. Advanced — logs, errors and backups\n\n<b>Do not rely on `storage/logs/laravel.log` on one server.</b>\n\n```text\nserver A → logs        worker A → logs\nserver B → logs        worker B → logs\n```\n\nWith three servers, <b>you have a one-in-three chance of looking at the right machine</b>, and no way to follow a request that crossed two of them. Aggregate centrally, and log JSON so it is searchable.\n\n<b>Logs tell you what happened; error tracking tells you what is affecting users.</b>\n\n```text\nwhich errors, how often, which release introduced it, what stack trace\n```\n\n<b>That last one is why you tag releases in your error tracker</b>: \"started 40 minutes ago\" plus \"release abc123\" is a diagnosis, where a log file is an archaeology project.\n\n<b>Backups.</b> Your database is not a backup. Consider frequency, retention, off-site storage, encryption and restore testing.\n\n> <b>A backup you have never successfully restored is not a backup strategy.</b>\n\n<b>Untested backups fail in specific, boring ways</b>: the job silently stopped three months ago, the file is truncated, the dump excluded a table, nobody has the decryption key. You find out on the day it matters, and by then the answer is no.\n\n<b>So restore one, on a schedule</b>, into a scratch database, and check a row count. Then you know two numbers that matter: <b>how much data you would lose, and how long recovery takes.</b> Without a rehearsal, both are guesses.",
      diagram: `Secrets

    ❌  $password = 'my-production-password';
    ✅  environment → Laravel config → application

    APP_ENV · APP_KEY · DB_HOST · DB_PASSWORD
    REDIS_HOST · AWS_ACCESS_KEY_ID

  Never commit: .env · API keys · database passwords
  cloud credentials · AI provider keys

  ⚠️  ONCE A SECRET IS EXPOSED, ROTATE IT.

      Deleting it from the latest commit is not
      enough. It is in the history, in every clone,
      in every fork — and quite possibly already
      scraped, because bots watch public commits for
      exactly this.

      Removing the commit changes nothing about who
      already has the key.


CI/CD

    push → CI → tests → lint → build → deploy

    developer → git push → GitHub Actions
                   ├── tests
                   ├── Pint
                   └── build
                        ↓
                     deploy

  The point is the GATE, not the automation:

    push broken code → deploy → 💥
    push broken code → tests fail → DEPLOY STOPS

  A reasonable pipeline:

    checkout → PHP deps → frontend deps → Pint
    → tests → build assets → deploy → migrate
    → restart workers

    Do not deploy code that has not passed your
    automated quality gates.

  And CI is where deploys stop being a PERSON'S
  RITUAL. A deploy in somebody's terminal history
  goes wrong the week they are away.


Logs

    server A → logs        worker A → logs
    server B → logs        worker B → logs

  ⚠️  With three servers you have a one-in-three
      chance of looking at the right machine — and no
      way to follow a request that crossed two.

              log system
             /     |     \\
        server A  server B  worker

    aggregate centrally, and log JSON so it is
    searchable


Error tracking

    logs            "what happened?"
    error tracking  "what is affecting USERS?"

      which errors · how often
      WHICH RELEASE INTRODUCED IT · stack trace

  Tag releases in your error tracker: "started 40
  minutes ago" + "release abc123" is a DIAGNOSIS.
  A log file is an archaeology project.


Backups

  Your database is not a backup.

    frequency · retention · off-site · encryption
    RESTORE TESTING

  ⚠️  A BACKUP YOU HAVE NEVER SUCCESSFULLY RESTORED
      IS NOT A BACKUP STRATEGY.

      Untested backups fail in boring, specific ways:

        the job silently stopped three months ago
        the file is truncated
        the dump excluded a table
        nobody has the decryption key

      You find out on the day it matters, and by then
      the answer is no.

  Restore one on a SCHEDULE, into a scratch database,
  and check a row count.

  Then you know the two numbers that matter:

    how much data you would LOSE
    how long RECOVERY takes

  Without a rehearsal, both are guesses.`,
      codeExample: {
        title: "A pipeline, structured logs, and a backup you have actually restored",
        code: `# ---------- .github/workflows/deploy.yml ----------

name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8
        env: { MYSQL_ROOT_PASSWORD: root, MYSQL_DATABASE: testing }
      redis:
        image: redis:7

    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.4' }

      - run: composer install --prefer-dist --no-interaction
      - run: npm ci

      # The gate. Nothing below runs if these fail.
      - run: ./vendor/bin/pint --test
      - run: ./vendor/bin/phpstan analyse
      - run: php artisan test

      - run: npm run build

  deploy:
    needs: test              # ← the whole point
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.DEPLOY_HOST }}
          key:  \${{ secrets.DEPLOY_KEY }}
          script: /var/www/invoicehub/deploy.sh

# Broken code now stops at "tests fail" instead of at
# "production 💥". And the deploy is no longer a ritual
# only one person can perform.


# ---------- ⚠️ A committed secret ----------

# ❌ Not enough
git rm --cached .env
git commit -m "remove .env"

# It is still in the history, in every clone, in every
# fork — and bots watch public commits for exactly this.

# ✅ The only thing that works
#   1. rotate the key at the provider, immediately
#   2. then clean the history if you want to
#   3. add a scanner so it cannot happen again
#
# .gitignore
.env
.env.*
!.env.example


<?php
// ---------- Structured logs, to stdout, with context ----------

// config/logging.php
'channels' => [
    'stack' => [
        'driver'   => 'stack',
        'channels' => ['stderr'],
    ],
    'stderr' => [
        'driver'    => 'monolog',
        'handler'   => StreamHandler::class,
        'with'      => ['stream' => 'php://stderr'],
        'formatter' => JsonFormatter::class,     // searchable
    ],
],

// Context that makes a log line findable across servers
Log::withContext([
    'request_id' => Str::uuid(),
    'user_id'    => auth()->id(),
    'release'    => config('app.release'),
    'server'     => gethostname(),
]);

// With three servers you otherwise have a one-in-three
// chance of looking at the right machine.


<?php
// ---------- Error tracking, tagged by release ----------

// The release tag is what turns "an error" into a
// diagnosis: "started 40 minutes ago, release abc123".
Sentry::configureScope(function ($scope) {
    $scope->setTag('release', config('app.release'));
    $scope->setTag('server', gethostname());
});

// And failed jobs are errors too — not a table nobody reads
Queue::failing(fn (JobFailed $e) => report($e->exception));


# ---------- Backups, and the part everyone skips ----------

# The backup
0 3 * * * pg_dump invoicehub | gzip | age -r "\$KEY" \\
    | aws s3 cp - s3://backups/invoicehub/\$(date +\\%F).sql.gz.age

# ⚠️ The restore rehearsal. This is what makes it a
#    strategy rather than a hope.
0 5 * * 0 /usr/local/bin/verify-restore.sh


#!/usr/bin/env bash
# verify-restore.sh
set -euo pipefail

LATEST=$(aws s3 ls s3://backups/invoicehub/ | sort | tail -1 | awk '{print $4}')

aws s3 cp "s3://backups/invoicehub/\${LATEST}" - \\
  | age -d -i /etc/age/key | gunzip | psql restore_test

ROWS=$(psql restore_test -tAc "select count(*) from invoices")

if [ "\$ROWS" -lt 1000 ]; then
    echo "Restore produced \${ROWS} invoices. Backup is not usable." >&2
    exit 1                              # ← a real alert
fi

echo "Restore verified: \${ROWS} invoices from \${LATEST}."

# Now you know the two numbers that matter:
#   how much data you would lose   (backup age)
#   how long recovery takes        (this script's runtime)
#
# Without the rehearsal, both are guesses — and untested
# backups fail in boring ways: the job stopped three
# months ago, the file is truncated, a table was
# excluded, nobody has the key.`,
      },
      keyTakeaways: [
        "<b>Configuration comes from the environment, never hardcoded.</b>",
        "<b>Never commit `.env`, API keys, database passwords or cloud credentials.</b>",
        "<b>Once a secret is exposed, rotate it</b>: deleting the commit changes nothing.",
        "<b>It is in the history, every clone and every fork</b>, and bots scrape public commits for keys.",
        "<b>CI/CD's point is the gate</b>: broken code stops at failing tests instead of in production.",
        "<b>A pipeline runs Pint, tests and a build before deploying, migrating and restarting workers.</b>",
        "<b>CI also stops deploys being one person's ritual</b>, which fails the week they are away.",
        "<b>Do not rely on one server's log file</b>: with three servers you are guessing which to read.",
        "<b>Aggregate logs centrally and log JSON</b>, with a request ID, user, release and hostname.",
        "<b>Logs say what happened; error tracking says what is affecting users and which release caused it.</b>",
        "<b>A backup you have never restored is not a backup strategy.</b>",
        "<b>Rehearse a restore on a schedule</b>, so you know how much data you lose and how long recovery takes.",
      ],
      commonMistakes: [
        "<b>Removing a committed secret without rotating it.</b> Everyone who cloned the repo still has it.",
        "<b>Deploying without a test gate.</b> CI that does not block is just a slower notification.",
        "<b>Deploying from one person's terminal.</b> It breaks the week they are on holiday.",
        "<b>Logs on individual servers.</b> You cannot follow a request that crossed two of them.",
        "<b>No release tag in error tracking.</b> \"Which deploy caused this\" becomes archaeology.",
        "<b>Backups nobody has restored.</b> They fail in boring ways, and you find out on the worst day.",
      ],
      quiz: [
        {
          question: "What must you do when a secret is committed?",
          options: [
            "Delete the commit",
            "Rotate it, because it is in the history, every clone and every fork, and may already be scraped",
            "Rewrite the branch",
            "Add it to `.gitignore`",
          ],
          correctIndex: 1,
          explanation: "Removing the commit changes nothing about who already has the key.",
        },
        {
          question: "What is the point of CI/CD?",
          options: [
            "Faster deploys",
            "The gate: broken code stops at failing tests instead of reaching production",
            "Automatic rollbacks",
            "Smaller images",
          ],
          correctIndex: 1,
          explanation: "And it stops deploys being one person's ritual.",
        },
        {
          question: "Why is a single server's log file insufficient?",
          options: [
            "It grows too large",
            "With three servers you are guessing which one to read, and cannot follow a request across two",
            "Laravel rotates it",
            "It is not readable",
          ],
          correctIndex: 1,
          explanation: "Aggregate centrally with a request ID and release tag.",
        },
        {
          question: "What makes a backup an actual strategy?",
          options: [
            "Daily frequency",
            "Having successfully restored one, so you know how much data you lose and how long recovery takes",
            "Off-site storage",
            "Encryption",
          ],
          correctIndex: 1,
          explanation: "Untested backups fail in boring ways on the worst possible day.",
        },
        {
          question: "What does error tracking give you that logs do not?",
          options: [
            "More detail",
            "Which errors affect users, how often, and which release introduced them",
            "Longer retention",
            "Faster search",
          ],
          correctIndex: 1,
          explanation: "The release tag turns an error into a diagnosis.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which deployment layer is most often forgotten?",
      options: [
        "Infrastructure",
        "Processes: queue workers and the scheduler",
        "Application",
        "Data",
      ],
      correctIndex: 1,
      explanation: "The site loads and nothing else works, with no errors anywhere.",
    },
    {
      question: "What happens when no queue worker is running?",
      options: [
        "`dispatch()` throws",
        "It succeeds, the job sits in the queue, and nothing errors",
        "The job runs inline",
        "The request fails",
      ],
      correctIndex: 1,
      explanation: "The most common \"my deploy worked\" failure.",
    },
    {
      question: "What is the useful question to ask of each production component?",
      options: [
        "Is it fast?",
        "How would I know if this were broken?",
        "Is it documented?",
        "Does it scale?",
      ],
      correctIndex: 1,
      explanation: "\"A customer would tell me\" means it is running, not deployed.",
    },
    {
      question: "What is the strongest argument for `composer install --no-dev`?",
      options: [
        "Faster installs",
        "Attack surface: debug and database-browser packages reachable in production are real holes",
        "Smaller repository",
        "Composer requires it",
      ],
      correctIndex: 1,
      explanation: "The reliable way not to expose one is not to install it.",
    },
    {
      question: "Why must caching come last in a deploy script?",
      options: [
        "It is slow",
        "Caching before the new code and `.env` are in place caches the previous values",
        "Laravel requires it",
        "It does not matter",
      ],
      correctIndex: 1,
      explanation: "The code is new, the env file is new, and the application disagrees with both.",
    },
    {
      question: "What does `set -e` prevent in a deploy script?",
      options: [
        "Slow deploys",
        "A failed step being followed by caching, worker restarts and a switch to a broken release",
        "Permission errors",
        "Migration conflicts",
      ],
      correctIndex: 1,
      explanation: "Otherwise the script exits 0 and reports success.",
    },
    {
      question: "Why does `migrate` need `--force` in CI?",
      options: [
        "It is faster",
        "Laravel prompts for confirmation in production and CI has nobody to answer",
        "It skips checks",
        "It runs migrations twice",
      ],
      correctIndex: 1,
      explanation: "It says explicitly: I know this is production, proceed.",
    },
    {
      question: "Why is renaming a column in one migration dangerous?",
      options: [
        "It is slow",
        "Both code versions run during a deploy, so old servers query a column that no longer exists",
        "Renames are unsupported",
        "It loses data",
      ],
      correctIndex: 1,
      explanation: "Queue workers on old code hit the same failure.",
    },
    {
      question: "What are the four steps of expand-contract?",
      options: [
        "Backup, migrate, deploy, verify",
        "Expand the schema, deploy dual-reading code, backfill the data, contract later",
        "Deploy, migrate, rollback, retry",
        "Test, build, deploy, monitor",
      ],
      correctIndex: 1,
      explanation: "At every step both old and new code work.",
    },
    {
      question: "Why backfill in a command rather than a migration?",
      options: [
        "Migrations cannot update data",
        "A migration holds a transaction across every row and can lock the table while the deploy waits",
        "Commands are faster",
        "Style preference",
      ],
      correctIndex: 1,
      explanation: "Keep schema changes separate from data changes.",
    },
    {
      question: "What is the real rollback strategy for a bad deploy?",
      options: [
        "`migrate:rollback`",
        "Deploying the previous code, which requires the schema to still support it",
        "Restoring a backup",
        "Maintenance mode",
      ],
      correctIndex: 1,
      explanation: "Expand-contract is what guarantees the old code still runs.",
    },
    {
      question: "What is the mental model for Laravel Forge?",
      options: [
        "A managed platform",
        "It manages servers you own, so the server, bill and responsibility stay yours",
        "Serverless on AWS",
        "A CI system",
      ],
      correctIndex: 1,
      explanation: "Including OS updates, disk space, patches and the pager.",
    },
    {
      question: "Why is Vapor an architecture choice rather than a hosting one?",
      options: [
        "It is AWS-only",
        "No reliable local filesystem, execution limits, cold starts and connection limits change your code",
        "It costs more",
        "It requires Docker",
      ],
      correctIndex: 1,
      explanation: "An app assuming a local disk gets rewritten to move there.",
    },
    {
      question: "How does cost compare between serverless and fixed servers?",
      options: [
        "Serverless is always cheaper",
        "It inverts with traffic shape: serverless suits spiky and low, fixed suits constant and high",
        "Fixed is always cheaper",
        "They are identical",
      ],
      correctIndex: 1,
      explanation: "And the answer changes as you grow.",
    },
    {
      question: "What does a multi-stage Docker build achieve?",
      options: [
        "Faster builds only",
        "The runtime image contains only what running needs, not Composer, npm or the toolchain",
        "Automatic secrets",
        "Multiple environments",
      ],
      correctIndex: 1,
      explanation: "Smaller and safer, the same argument as `--no-dev`.",
    },
    {
      question: "Why must secrets never go into a Docker image?",
      options: [
        "They increase size",
        "They are baked into a layer, and layers are readable by anybody who can pull the image",
        "Docker strips them",
        "They expire",
      ],
      correctIndex: 1,
      explanation: "Inject them at runtime instead.",
    },
    {
      question: "Why run the same image in staging and production?",
      options: [
        "To save build time",
        "Building per environment means you tested something you did not ship",
        "Docker requires it",
        "For smaller images",
      ],
      correctIndex: 1,
      explanation: "Same image, different environment variables.",
    },
    {
      question: "Why separate web, worker and scheduler containers?",
      options: [
        "Smaller images",
        "A container is one process: combined, a worker crash takes the web tier and nothing scales separately",
        "Docker cannot run two processes",
        "For logging",
      ],
      correctIndex: 1,
      explanation: "Same image, three different commands.",
    },
    {
      question: "Why is deploying into the live directory worse than the downtime window suggests?",
      options: [
        "It is slower",
        "The site is broken during the deploy: half new files, half old, an application that never existed",
        "Permissions break",
        "Git is slow",
      ],
      correctIndex: 1,
      explanation: "Atomic releases make the switch instantaneous.",
    },
    {
      question: "What is the real prize of atomic releases?",
      options: [
        "Faster deploys",
        "A rollback that is one symlink and no rebuild, which you will actually use under pressure",
        "Less disk usage",
        "Simpler scripts",
      ],
      correctIndex: 1,
      explanation: "Otherwise people debug live because redeploying feels too slow.",
    },
    {
      question: "What happens if a deploy fails between `down` and `up`?",
      options: [
        "Laravel recovers",
        "The site stays in maintenance mode until somebody notices and runs `up` by hand",
        "The deploy retries",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "A trap that always runs `up` prevents it.",
    },
    {
      question: "Why must a health check test more than the homepage?",
      options: [
        "Completeness",
        "A cached homepage returns 200 even with broken database credentials, so the switch is a guess",
        "For monitoring",
        "It need not",
      ],
      correctIndex: 1,
      explanation: "Check database, cache and queue before promoting.",
    },
    {
      question: "Why is Supervisor not optional?",
      options: [
        "Laravel requires it",
        "Workers exit as normal behaviour, from crashes and from `--max-time`, so something must restart them",
        "It runs the scheduler",
        "It manages memory",
      ],
      correctIndex: 1,
      explanation: "A worker exiting is expected, not exceptional.",
    },
    {
      question: "Why does the scheduler need a cron entry?",
      options: [
        "For logging",
        "Laravel's scheduler does not run itself; cron calls `schedule:run` every minute",
        "To set the timezone",
        "It does not",
      ],
      correctIndex: 1,
      explanation: "Without it, every scheduled task silently never runs.",
    },
    {
      question: "Why must a deploy run `queue:restart`?",
      options: [
        "To clear the queue",
        "Workers hold the old code in memory and keep running it indefinitely",
        "To reset failures",
        "For monitoring",
      ],
      correctIndex: 1,
      explanation: "Jobs otherwise behave like last week while the site behaves like today.",
    },
    {
      question: "Why give each queue its own worker pool?",
      options: [
        "For monitoring",
        "A shared pool lets an hour-long report block every quick email behind it",
        "Redis requires it",
        "For memory limits",
      ],
      correctIndex: 1,
      explanation: "Separate pools, sized separately.",
    },
    {
      question: "What must you do when a secret is committed?",
      options: [
        "Delete the commit",
        "Rotate it, because it is in the history, every clone and every fork, and may already be scraped",
        "Rewrite the branch",
        "Add it to `.gitignore`",
      ],
      correctIndex: 1,
      explanation: "Removing the commit changes nothing about who already has the key.",
    },
    {
      question: "What is the point of CI/CD?",
      options: [
        "Faster deploys",
        "The gate: broken code stops at failing tests instead of reaching production",
        "Automatic rollbacks",
        "Smaller images",
      ],
      correctIndex: 1,
      explanation: "And it stops deploys being one person's ritual.",
    },
    {
      question: "Why is a single server's log file insufficient?",
      options: [
        "It grows too large",
        "With three servers you are guessing which to read, and cannot follow a request across two",
        "Laravel rotates it",
        "It is not readable",
      ],
      correctIndex: 1,
      explanation: "Aggregate centrally with a request ID and release tag.",
    },
    {
      question: "What makes a backup an actual strategy?",
      options: [
        "Daily frequency",
        "Having successfully restored one, so you know how much data you lose and how long recovery takes",
        "Off-site storage",
        "Encryption",
      ],
      correctIndex: 1,
      explanation: "Untested backups fail in boring ways on the worst possible day.",
    },
  ],
  project: {
    name: "InvoiceHub — deploy it, then break it on purpose",
    goal: "Deploy the whole system with a worker and a scheduler running, then prove each layer works by killing it one piece at a time and recording how you found out.",
    brief:
      "The self-check is to deploy the app with a worker and a scheduler. <b>Deploying is the easy half.</b> The hard half is that everything except the web server fails silently, so a deploy that looks perfect can have a dead worker and a scheduler nobody ever triggered.\n\nSo this project has two parts. Build it, then <b>break each piece deliberately and write down how long it took you to notice</b>. Anything you only noticed by looking directly at it is not monitored, it is just running.\n\nWhat has to be true at the end:\n\n```text\nweb        GET / → 200\nqueue      request → dispatch → worker → job executes\nscheduler  cron → schedule:run → a task runs on its own\ndatabase   deploy → migrate --force → schema updated\nCI/CD      push → tests → Pint → build → deploy\nsafety     .env uncommitted · backups · logs · error tracking\n```\n\nAnd the principle you are implementing:\n\n> <b>A deployment is successful when the application, workers, scheduler, database, configuration, monitoring and recovery all work, not when the website loads.</b>",
    steps: [
      "Pick a platform and write down why in one sentence: Forge if a named person will own the server, Cloud if nobody will, Vapor only if you have audited your filesystem and job durations first.",
      "Write a deploy script that starts with `set -euo pipefail`, then: pull, `composer install --no-dev --optimize-autoloader`, `npm ci && npm run build`, `optimize:clear`, `migrate --force`, the four caches, `queue:restart`, and a health-check curl at the end. Clear before caching, and cache last.",
      "Make it atomic: build into `/releases/<timestamp>`, symlink `.env` and `storage/` from a shared directory, and switch `/current` at the end. Then write a `rollback.sh` that switches the symlink back and reloads. Time it. If it is over five seconds you will not use it at 3am.",
      "Build a health endpoint that checks database, cache, queue depth and a scheduler heartbeat, and returns 503 if any fail. Gate your deploy on it. A homepage 200 will happily promote a release with wrong database credentials.",
      "Set up Supervisor with two separate worker pools, `emails` and `reports`, with `--max-time=3600`, `--tries=3`, sensible `--backoff`, `autorestart=true` and a `stopwaitsecs` long enough for your longest job. Run `supervisorctl status` and confirm both pools are up.",
      "Add the single cron entry calling `schedule:run` every minute. Then add a scheduler heartbeat task writing to the cache every minute, plus one real task using `withoutOverlapping(50)`, `onOneServer()` and a failure ping.",
      "Set up CI: checkout, dependencies, Pint, PHPStan, tests, build, and a deploy job with `needs: test`. Push something that fails Pint and confirm the deploy does not run. That one experiment is the whole point of CI.",
      "Configure structured JSON logging to stdout with request ID, user ID, release and hostname in the context. Add error tracking with the release tagged, and register a `Queue::failing` handler so failed jobs reach a human rather than a table.",
      "Set up backups with encryption and off-site storage. Then write the restore script: pull the latest backup, decrypt, load into a scratch database, count rows, and exit non-zero if the count is implausible. Run it manually once and record how long it took.",
      "Do an expand-contract migration for real. Rename a column across four deploys: add nullable, deploy dual-reading code, backfill in a chunked command, then drop the old column. Deploy each step separately and confirm the site works between each.",
      "NOW BREAK IT, one at a time, restoring between each. (1) Stop the workers and dispatch a job. (2) Comment out the cron entry. (3) Deploy without `queue:restart` and change a job's behaviour. (4) Put a wrong database password in `.env` and deploy. (5) Delete the latest backup file and run your restore script. For each, record what you saw, how you found out, and how long it took.",
      "Write the table: five failures, how you detected each, and detection time. Then fix whatever you only found by looking directly at it, because that piece is not monitored.",
    ],
    acceptance: [
      "The deploy script uses `set -euo pipefail`, clears before caching, caches last, and ends with a health check.",
      "Releases are atomic, `.env` and `storage/` are shared rather than copied, and rollback is a symlink switch under five seconds.",
      "The health endpoint checks database, cache, queue depth and scheduler heartbeat, and the deploy is gated on it.",
      "Two Supervisor worker pools run with `autorestart`, a max lifetime and a graceful stop timeout, verified with `supervisorctl status`.",
      "One cron entry invokes `schedule:run`, a heartbeat proves it, and the real task has overlap, one-server and failure protection.",
      "CI runs Pint, static analysis and tests, and a deliberately failing push demonstrably does not deploy.",
      "Logs are structured JSON on stdout with request ID, release and hostname, and failed jobs reach a human.",
      "Backups are encrypted and off-site, and a restore script has been run successfully at least once with a recorded duration.",
      "The expand-contract rename was done across four separate deploys, with the site working between each.",
      "All five deliberate failures are documented with what you saw, how you detected it, and how long it took.",
      "Anything detected only by looking directly at it now has monitoring.",
      "`.env` is not in the repository, and `git log -p` contains no secrets.",
    ],
    stretch: [
      "Run `php artisan down` and then make your deploy script fail. Watch the site stay down. Add the `trap 'php artisan up' EXIT` line and repeat. That is thirty seconds of work and one of the most common self-inflicted outages there is.",
      "Do a rolling deploy across two servers with a breaking migration in one step. Watch half your traffic error while the other half works. Then redo it with expand-contract and confirm neither half breaks.",
      "Generate a maintenance secret, use it to verify a deploy while the site is down for everyone else, then rotate it. Note that it is an authentication bypass and decide where it will live in your process.",
      "Commit a fake API key to a scratch repository, push it, then try to remove it with `git rm --cached`. Clone the repo fresh and find the key still in the history. That is why the answer is rotation.",
      "Measure your recovery numbers properly: restore the backup and record how much data would have been lost given the backup age, and how long the restore took end to end. Those two numbers are what an incident actually costs you.",
      "Containerise it: a multi-stage Dockerfile, one image, three containers (web, worker, scheduler) from the same tag. Then run the same image locally with different environment variables and confirm it behaves identically.",
    ],
  },
};
