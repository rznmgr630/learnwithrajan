import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_30_LESSONS: LessonDay = {
  day: 30,
  title: "Artisan, tooling & code quality",
  totalMinutes: 93,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "artisan-as-an-interface",
      title: "Artisan as your application's operational interface",
      durationMinutes: 11,
      explanation: "Everything so far has been the application. Today is everything <b>around</b> it.\n\n```text\nLaravel application\n  ├── Artisan      developer & operational commands\n  ├── Prompts      interactive CLI\n  ├── Pint         code style\n  ├── Telescope    local debugging\n  ├── Pulse        application health\n  ├── Nightwatch   production monitoring\n  ├── Boost / MCP  AI-assisted development\n  ├── Envoy        remote tasks\n  └── Pennant      feature flags\n```\n\nThe question underneath all of it: <b>how do I make this application easier to develop, debug, operate, monitor and evolve?</b>\n\n---\n\n### 1. Basic — what Artisan is\n\n```text\nterminal → Artisan → your Laravel application\n```\n\nYou have used it for thirty days:\n\n```bash\nphp artisan migrate\nphp artisan queue:work\nphp artisan make:model User\nphp artisan test\n```\n\n<b>The shift today is seeing it as more than a generator.</b> Your app has an HTTP interface for users. Artisan is the interface for <b>you</b>: the operator. Reprocess failed payments, backfill a column, export a client's data, retry a stuck sync. Every one of those either becomes a command or becomes a database query somebody runs by hand at 2am.\n\n```bash\nphp artisan make:command SendDailyReports\n```\n\nThree pieces matter: <b>`$signature`</b>, <b>`$description`</b>, <b>`handle()`</b>.\n\n---\n\n### 2. Intermediate — closure commands and calling from code\n\nTiny commands can live in `routes/console.php` as closures. <b>Good for genuinely small things</b>: printing a value, flipping a flag. Anything with real logic wants a class, because a closure cannot be tested with `$this->artisan(...)` as comfortably and has nowhere to inject dependencies.\n\nOne command can call another:\n\n```php\n$this->call('reports:generate', ['--force' => true]);\nArtisan::call('cache:clear');\n```\n\n<b>Useful, and easy to abuse.</b>\n\n---\n\n### 3. Advanced — where the logic actually belongs\n\nThe anti-pattern:\n\n```text\n❌ Controller → Artisan::call('users:process') → business logic\n```\n\n<b>That is a shell command as your service layer.</b> You lose type safety, you lose the return value, exceptions arrive as exit codes, and it cannot be tested without booting the console kernel.\n\nThe shape you want:\n\n```text\nController ─┐\nCommand   ──┼→ Service → business logic\nJob       ──┘\n```\n\n<b>The command is an entry point, not a home.</b> Same rule you learned for controllers on Day 8, and for jobs on Day 26: the thin thing takes input and hands off. That is what makes the same logic reachable from HTTP, from the scheduler and from a queue without being written three times.\n\nAnd Laravel 13 adds a local-development runner:\n\n```bash\nphp artisan dev        # tabbed UI: server, queue, Vite, Reverb, logs\nphp artisan dev:list    # what processes this project defines\n```\n\n<b>Which matters more than it sounds</b>, because a modern Laravel app needs four or five processes running at once, and the classic failure is forgetting one. Your queue does nothing, and you spend twenty minutes debugging a job that was never picked up.",
      diagram: `The layer around the application

  Laravel application
    ├── Artisan      developer & operational commands
    ├── Prompts      interactive CLI
    ├── Pint         code style
    ├── Telescope    local debugging
    ├── Pulse        application health
    ├── Nightwatch   production monitoring
    ├── Boost / MCP  AI-assisted development
    ├── Envoy        remote tasks
    └── Pennant      feature flags

  The question underneath all of it:

    how do I make this easier to develop, debug,
    operate, monitor and evolve?


Artisan is an INTERFACE

    terminal → Artisan → your application

  Your app has an HTTP interface for USERS.
  Artisan is the interface for YOU, the operator.

    reprocess failed payments
    backfill a column
    export a client's data
    retry a stuck sync

  Each of those either becomes a command, or becomes
  a database query somebody runs by hand at 2am.

    php artisan make:command SendDailyReports

      $signature      $description      handle()


Closure commands

    routes/console.php

    fine for genuinely small things — printing a
    value, flipping a flag

    anything with real logic wants a class: nowhere
    to inject dependencies, harder to test


Where the logic belongs

    ❌  Controller
          ↓
        Artisan::call('users:process')
          ↓
        business logic

        A shell command as your service layer. No
        type safety, no return value, exceptions
        arrive as exit codes, untestable without
        the console kernel.

    ✅  Controller ─┐
        Command   ──┼→  Service  →  business logic
        Job       ──┘

  The command is an ENTRY POINT, not a home. Same
  rule as controllers (Day 8) and jobs (Day 26).

  That is what makes one piece of logic reachable
  from HTTP, the scheduler and a queue without being
  written three times.


Laravel 13 local runner

    php artisan dev        tabbed UI
    php artisan dev:list   what this project defines

  ┌──────────┬─────────┬─────────┬────────┐
  │ Server   │ Queue   │ Vite    │ Reverb │
  └──────────┴─────────┴─────────┴────────┘

  A modern app needs 4–5 processes at once, and the
  classic failure is forgetting one: your queue does
  nothing and you debug a job that was never picked
  up.`,
      codeExample: {
        title: "Commands as entry points",
        code: `<?php
// ---------- The operational interface ----------

php artisan make:command RetryFailedPayments

// app/Console/Commands/RetryFailedPayments.php
namespace App\\Console\\Commands;

use App\\Services\\PaymentRetrier;
use Illuminate\\Console\\Command;

class RetryFailedPayments extends Command
{
    protected $signature = 'payments:retry {--since=24}';

    protected $description = 'Retry payments that failed in the last N hours';

    // The service is injected — same class the controller uses
    public function handle(PaymentRetrier $retrier): int
    {
        $result = $retrier->retrySince(
            now()->subHours((int) $this->option('since'))
        );

        $this->info("Retried {$result->attempted}, recovered {$result->succeeded}.");

        return $result->failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}

// Without this command, "retry the failed payments" is
// a database query somebody runs by hand at 2am.


<?php
// ---------- One service, three entry points ----------

// app/Services/PaymentRetrier.php — where the logic lives
final class PaymentRetrier
{
    public function retrySince(CarbonInterface $since): RetryResult
    {
        // ...
    }
}

// 1. HTTP
class PaymentRetryController
{
    public function store(PaymentRetrier $retrier)
    {
        return response()->json($retrier->retrySince(now()->subDay()));
    }
}

// 2. Console — the command above

// 3. Scheduler / queue
Schedule::job(new RetryPaymentsJob())->hourly();

// Written once. Reachable from all three.


<?php
// ---------- The anti-pattern ----------

// ❌ A shell command as your service layer
class PaymentRetryController
{
    public function store()
    {
        Artisan::call('payments:retry', ['--since' => 24]);

        return response()->noContent();
    }
}
// No return value you can use. Exceptions arrive as an
// exit code. Untestable without the console kernel.


<?php
// ---------- Calling a command from a command ----------

public function handle(): int
{
    $this->call('reports:generate', ['--force' => true]);
    $this->callSilently('cache:clear');       // no output

    return self::SUCCESS;
}


<?php
// ---------- Closure commands: routes/console.php ----------

use Illuminate\\Support\\Facades\\Schedule;

Artisan::command('invoices:count', function () {
    $this->info(Invoice::count() . ' invoices.');
})->purpose('Print the invoice count');

// Fine. But the moment it needs a dependency or a test,
// make it a class.


# ---------- Laravel 13 local runner ----------

php artisan dev
# ┌──────────┬─────────┬─────────┬────────┬──────┐
# │ Server   │ Queue   │ Vite    │ Reverb │ Logs │
# └──────────┴─────────┴─────────┴────────┴──────┘

php artisan dev:list
# What this project actually defines, so you stop
# debugging a job that no worker was running.`,
      },
      keyTakeaways: [
        "<b>Artisan is your application's operational interface</b>, the way HTTP is its user interface.",
        "<b>Anything you would otherwise do by hand in the database should be a command</b>: backfills, retries, exports.",
        "<b>`make:command` gives you three pieces</b>: `$signature`, `$description` and `handle()`.",
        "<b>Closure commands in `routes/console.php` suit genuinely tiny tasks</b>, and nothing with dependencies.",
        "<b>A command is an entry point, not a home for logic</b>, exactly like a controller or a job.",
        "<b>Controller, command and job should all call the same service</b>, so the logic exists once.",
        "<b>Never call Artisan from a controller as your service layer</b>: no return value, exceptions become exit codes.",
        "<b>`php artisan dev` runs the whole local process set</b> in one tabbed UI, and `dev:list` shows what exists.",
        "<b>The classic local failure is a forgotten process</b>, then twenty minutes debugging a job nobody was running.",
      ],
      commonMistakes: [
        "<b>Treating Artisan as only a code generator.</b> It is the interface you operate the application through.",
        "<b>Putting business logic inside `handle()`.</b> Nothing else can reuse it and it is awkward to test.",
        "<b>Calling `Artisan::call` from a controller.</b> You have made a shell command into your service layer.",
        "<b>Writing substantial closure commands.</b> No dependency injection and harder to test.",
        "<b>Doing operational fixes by hand in the database.</b> Unrepeatable, unreviewable and unlogged.",
      ],
      quiz: [
        {
          question: "What is the most useful way to think about Artisan?",
          options: [
            "A code generator",
            "Your application's operational interface, the way HTTP is its user interface",
            "A migration runner",
            "A testing tool",
          ],
          correctIndex: 1,
          explanation: "Backfills, retries and exports belong there rather than in a hand-run query.",
        },
        {
          question: "Where should a command's business logic live?",
          options: [
            "In `handle()`",
            "In a service the controller, command and job all call",
            "In a closure in `routes/console.php`",
            "In the model",
          ],
          correctIndex: 1,
          explanation: "The command is an entry point, so the logic exists once and is reachable three ways.",
        },
        {
          question: "What is wrong with `Artisan::call` from a controller?",
          options: [
            "It is slow",
            "No usable return value, exceptions arrive as exit codes, and it is untestable without the console kernel",
            "It is not allowed",
            "It bypasses middleware",
          ],
          correctIndex: 1,
          explanation: "That is a shell command standing in for a service layer.",
        },
        {
          question: "What problem does `php artisan dev` solve?",
          options: [
            "Slow builds",
            "A modern app needs several processes at once, and forgetting one wastes debugging time",
            "Missing migrations",
            "Code style",
          ],
          correctIndex: 1,
          explanation: "`dev:list` shows what the project defines.",
        },
      ],
    },
    {
      id: "signature-arguments-and-options",
      title: "The signature: arguments & options",
      durationMinutes: 11,
      explanation: "The signature is the command's whole public interface, written in one string.\n\n---\n\n### 1. Basic — the two kinds of input\n\n```php\nprotected $signature = 'reports:send {user} {--force}';\n```\n\n```bash\nphp artisan reports:send 123 --force\n```\n\n```text\nreports:send\n  ├── argument  user     positional\n  └── option    --force  named flag\n```\n\n<b>Arguments are positional, options are named.</b> That is the whole distinction, and it is the thing people mix up:\n\n```text\n{email}     argument\n{--force}   option\n```\n\nRead them in `handle()`:\n\n```php\n$email = $this->argument('email');\n$force = $this->option('force');\n```\n\n---\n\n### 2. Intermediate — the full syntax\n\n```php\n{user}                    required argument\n{user?}                   optional argument\n{user=1}                  default value\n{users*}                  array, one or more\n\n{--force}                 boolean flag\n{--queue=}                option that takes a value\n{--queue=default}         with a default\n{--Q|queue=}              with a shortcut\n\n{user : The user ID}      description, shown in help\n```\n\n<b>Optional arguments are what let one command work at two scopes:</b>\n\n```bash\nphp artisan reports:send        # everybody\nphp artisan reports:send 123    # one user\n```\n\nWhich is genuinely useful, and also the shape of a bad accident. <b>A command whose argument-less form does the destructive thing to everything</b> is one missing argument away from disaster. If the broad form is dangerous, make it explicit: `--all` should be a flag you type, not the default you get by forgetting.\n\n<b>Always write descriptions.</b> `{user : The user to send the report to}` is what `php artisan help reports:send` prints, and the person reading it at 3am is probably you.\n\n---\n\n### 3. Advanced — the signature is an API\n\n<b>Once a command is in a deploy script, a cron entry or a runbook, its signature is a contract.</b> Renaming an option breaks a scheduled task that has been running fine for a year, and nothing tells you until the job silently fails or, worse, runs with a default you did not intend.\n\nSo treat changes the way you would treat an API: <b>add options, avoid renaming them</b>, and if you must, keep the old name working for a release.\n\nTwo more habits.\n\n<b>Validate input in `handle()`, not in your head.</b> `$this->argument('user')` returns a string, always. `'abc'` becomes `0` if you cast it carelessly, and `User::find(0)` returns null, and now the branch you did not write runs.\n\n<b>And return an exit code.</b>\n\n```php\nreturn self::SUCCESS;   // 0\nreturn self::FAILURE;   // 1\n```\n\n<b>Falling off the end of `handle()` returns 0</b>, which tells the scheduler, your CI and your monitoring that everything is fine. A command that fails with exit `0` is a broken pipeline nobody notices, which is the same warning Day 29 gave about testing exit codes, arriving from the other side.",
      diagram: `Two kinds of input

    protected $signature = 'reports:send {user} {--force}';

    php artisan reports:send 123 --force

      reports:send
        ├── argument   user      POSITIONAL
        └── option     --force   NAMED

    {email}      argument
    {--force}    option

    $this->argument('email');
    $this->option('force');


The full syntax

    {user}                required argument
    {user?}               optional
    {user=1}              default
    {users*}              array, one or more

    {--force}             boolean flag
    {--queue=}            takes a value
    {--queue=default}     with a default
    {--Q|queue=}          with a shortcut

    {user : The user ID}  description → shown in help


Optional arguments = two scopes, one command

    php artisan reports:send          everybody
    php artisan reports:send 123      one user

  ⚠️  And the shape of a bad accident.

      A command whose argument-LESS form does the
      destructive thing to EVERYTHING is one missing
      argument away from disaster.

      If the broad form is dangerous:

        --all should be a flag you TYPE, not the
        default you get by forgetting


The signature is an API

  Once it is in a deploy script, a cron entry or a
  runbook, it is a CONTRACT.

    rename an option
      ↓
    a scheduled task that ran fine for a year breaks
      ↓
    silently, or worse: runs with a default you did
    not intend

    add options · avoid renaming · keep old names
    working for a release


Two habits

  Validate input — argument() ALWAYS returns a string

    'abc' → (int) → 0 → User::find(0) → null
      → the branch you never wrote now runs

  Return an exit code

    return self::SUCCESS;   // 0
    return self::FAILURE;   // 1

  ⚠️  Falling off the end of handle() returns 0.

      Which tells the scheduler, CI and monitoring
      that everything is fine. A command failing with
      exit 0 is a pipeline nobody notices.`,
      codeExample: {
        title: "Signatures, validation and exit codes",
        code: `<?php
// ---------- A signature that documents itself ----------

class SendReports extends Command
{
    protected $signature = 'reports:send
                            {user? : Send for one user, or omit for all}
                            {--since=7 : How many days back to include}
                            {--Q|queue=reports : Queue to dispatch on}
                            {--force : Skip the confirmation}';

    protected $description = 'Send activity reports';

    public function handle(ReportSender $sender): int
    {
        // argument() ALWAYS returns a string
        $userId = $this->argument('user');

        if ($userId !== null && ! ctype_digit($userId)) {
            $this->error('The user argument must be a numeric ID.');

            return self::INVALID;          // exit 2
        }

        $since = (int) $this->option('since');

        if ($since < 1) {
            $this->error('--since must be at least 1.');

            return self::INVALID;
        }

        $result = $sender->send(
            userId: $userId ? (int) $userId : null,
            since: now()->subDays($since),
            queue: $this->option('queue'),
        );

        $this->info("Queued {$result->count} reports.");

        return $result->failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}


<?php
// ---------- The accident waiting to happen ----------

// ❌ Forget the argument, delete everything
protected $signature = 'invoices:purge {client?}';

public function handle(): int
{
    Invoice::when($this->argument('client'), fn ($q, $id) =>
        $q->where('client_id', $id)
    )->delete();                       // no client → ALL invoices

    return self::SUCCESS;
}

// ✅ The broad form must be typed, not defaulted into
protected $signature = 'invoices:purge {client?} {--all}';

public function handle(): int
{
    $client = $this->argument('client');

    if (! $client && ! $this->option('all')) {
        $this->error('Pass a client ID, or --all to purge everything.');

        return self::INVALID;
    }

    // ...
}


<?php
// ---------- Array arguments ----------

protected $signature = 'invoices:resend {ids*}';

// php artisan invoices:resend 1 2 3
$ids = $this->argument('ids');       // ['1', '2', '3']


<?php
// ---------- Exit codes are what the scheduler reads ----------

public function handle(): int
{
    $failed = 0;

    foreach (Invoice::overdue()->cursor() as $invoice) {
        try {
            $this->reminder->send($invoice);
        } catch (Throwable $e) {
            report($e);
            $failed++;
        }
    }

    if ($failed > 0) {
        $this->error("{$failed} reminders failed.");

        return self::FAILURE;          // ← monitoring sees this
    }

    return self::SUCCESS;
}

// Falling off the end returns 0, and a command failing
// with exit 0 is a broken pipeline nobody notices.


# ---------- What descriptions buy you ----------

php artisan help reports:send
# Arguments:
#   user   Send for one user, or omit for all
# Options:
#   --since[=SINCE]  How many days back to include [default: "7"]
#
# The person reading this at 3am is probably you.`,
      },
      keyTakeaways: [
        "<b>Arguments are positional, options are named flags</b>: `{email}` versus `{--force}`.",
        "<b>Read them with `$this->argument()` and `$this->option()`</b>, and both come back as strings.",
        "<b>`{user?}` optional, `{user=1}` default, `{users*}` array, `{--queue=}` option with a value.</b>",
        "<b>Optional arguments let one command work at two scopes</b>, per-record and global.",
        "<b>That is also an accident shape</b>: a destructive command whose argument-less form hits everything.",
        "<b>Make the broad, dangerous form an explicit `--all`</b>, never the default you get by forgetting.",
        "<b>Write descriptions in the signature</b>, because that is what `php artisan help` prints.",
        "<b>Once a command is in a cron entry or runbook, its signature is a contract.</b>",
        "<b>Renaming an option breaks a scheduled task silently</b>, or worse, runs it with an unintended default.",
        "<b>Validate input</b>, since `'abc'` cast to int becomes `0` and `find(0)` returns null.",
        "<b>Return `self::SUCCESS` or `self::FAILURE`</b>, because falling off the end returns 0 and hides failures.",
      ],
      commonMistakes: [
        "<b>Confusing arguments and options.</b> `{--email}` is a flag; `{email}` is positional.",
        "<b>A destructive command that defaults to everything.</b> One forgotten argument and the data is gone.",
        "<b>Omitting descriptions.</b> `php artisan help` is then useless to the person on call.",
        "<b>Renaming an option that a cron entry uses.</b> The scheduled task fails or silently uses a default.",
        "<b>Never returning an exit code.</b> Everything looks green while the command fails nightly.",
      ],
      quiz: [
        {
          question: "What is the difference between `{email}` and `{--email=}`?",
          options: [
            "Nothing",
            "The first is a positional argument, the second a named option that takes a value",
            "The first is optional",
            "The second is faster",
          ],
          correctIndex: 1,
          explanation: "Arguments are positional; options are named.",
        },
        {
          question: "Why is `{client?}` risky on a destructive command?",
          options: [
            "Optional arguments are unsupported",
            "Forgetting the argument runs the destructive action against everything",
            "It breaks the scheduler",
            "It cannot be validated",
          ],
          correctIndex: 1,
          explanation: "Make the broad form an explicit `--all` instead.",
        },
        {
          question: "Why treat a command signature like an API?",
          options: [
            "It is not one",
            "Cron entries, deploy scripts and runbooks depend on it, so a rename breaks them silently",
            "Laravel enforces it",
            "For code style",
          ],
          correctIndex: 1,
          explanation: "Add options, avoid renaming, keep old names working for a release.",
        },
        {
          question: "What happens if `handle()` returns nothing?",
          options: [
            "It throws",
            "It exits 0, telling the scheduler and monitoring that a failed run succeeded",
            "It exits 1",
            "Laravel warns you",
          ],
          correctIndex: 1,
          explanation: "Return `self::FAILURE` so the failure is visible.",
        },
      ],
    },
    {
      id: "prompts",
      title: "Laravel Prompts — text, select, confirm & search",
      durationMinutes: 12,
      explanation: "A command with six required options is a command nobody can run without reading the source.\n\n```bash\n❌ php artisan user:create --name=... --email=... --role=... --team=...\n```\n\nPrompts asks instead:\n\n```text\nName:   Rajan\nEmail:  rajan@example.com\nAdmin?  Yes\n```\n\n---\n\n### 1. Basic — `text()` and `select()`\n\n```php\nuse function Laravel\\Prompts\\{text, select, confirm, search};\n\n$name = text(label: 'What is your name?');\n```\n\n```text\nWhat is your name? › Rajan\n```\n\n`select()` for a known set:\n\n```php\n$env = select(\n    label: 'Environment?',\n    options: ['local', 'staging', 'production'],\n);\n```\n\n```text\nChoose environment:\n❯ local\n  staging\n  production\n```\n\n<b>This is not just nicer, it is safer.</b> A free-text environment accepts `prod`, `Production` and `porduction`, and you now need validation for input that never had to be free-form. <b>A select cannot produce an invalid value.</b>\n\n---\n\n### 2. Intermediate — `confirm()` and `search()`\n\n```php\n$ok = confirm(label: 'Delete 100 users?', default: false);\n```\n\n```text\nDelete 100 users?\n○ Yes\n● No\n```\n\n<b>Note `default: false`.</b> On a destructive command the safe answer must be the one you get from hitting enter without reading, because that is what a tired person does.\n\n`search()` for a large set:\n\n```text\nChoose user: > raj\n  Rajan\n  Rajesh\n  Rajiv\n```\n\nIt queries as you type, so <b>you never build a select list of ten thousand users</b>, and the person running it does not need to know the ID.\n\nEvery prompt takes `validate:`, which is where you stop bad input at the door rather than three steps into `handle()`.\n\n---\n\n### 3. Advanced — the thing that breaks in production\n\n<b>Prompts need a terminal. The scheduler does not have one.</b>\n\n```text\nyou, interactively → prompt appears → you answer\ncron / CI / deploy → no TTY → the command hangs or throws\n```\n\nThis is the failure people hit: a command that works beautifully by hand, scheduled nightly, and every run sits waiting for an answer nobody will ever type. Or in CI, fails with no useful message.\n\n<b>So an interactive command needs a non-interactive path.</b> Two mechanisms:\n\n```php\nif ($this->option('no-interaction')) { ... }\n\n$name = $this->option('name') ?? text(label: 'Name?');\n```\n\n<b>The pattern: options are the real interface, prompts fill in what was not passed.</b> Then `php artisan user:create --name=X --email=Y -n` works in a script, and `php artisan user:create` works for a human, and it is the same command.\n\n<b>And on destructive commands, `--force` must skip the confirm.</b> Otherwise your deploy script hangs on a safety prompt, and somebody eventually deletes the safety prompt to fix the deploy.\n\nOne more: `$this->confirm()` and `$this->ask()` still exist from older Laravel, and `$this->components->askWith...` sits between them. <b>Prompts is what to use in new code</b>, but you will meet the old helpers in existing commands and they behave the same way about TTYs.",
      diagram: `The problem

    ❌ php artisan user:create --name=... --email=...
                              --role=... --team=...

       Nobody runs this without reading the source.

    ✅ Name:   Rajan
       Email:  rajan@example.com
       Admin?  Yes


The prompts

  text()      What is your name? › Rajan

  select()    Choose environment:
              ❯ local
                staging
                production

    Not just nicer — SAFER. Free text accepts
    'prod', 'Production', 'porduction', and now you
    need validation for input that never had to be
    free-form.

    A select CANNOT produce an invalid value.

  confirm()   Delete 100 users?
              ○ Yes
              ● No

    ⚠️  default: false on anything destructive.

        The safe answer must be what you get from
        hitting enter without reading — because that
        is what a tired person does.

  search()    Choose user: > raj
                Rajan
                Rajiv

    Queries as you type. No select list of 10,000
    users, and no need to know the ID.

  Every prompt takes validate: — stop bad input at
  the door, not three steps into handle().


⚠️  The thing that breaks in production

    PROMPTS NEED A TERMINAL. THE SCHEDULER HAS NONE.

    you, interactively  → prompt → you answer
    cron / CI / deploy  → no TTY → hangs, or throws

  A command that works beautifully by hand, scheduled
  nightly, sits every night waiting for an answer
  nobody will type.


The pattern that fixes it

    OPTIONS are the real interface.
    PROMPTS fill in what was not passed.

    $name = $this->option('name') ?? text(label: 'Name?');

    php artisan user:create --name=X --email=Y -n   script
    php artisan user:create                        human

    same command

  And on destructive commands --force must skip the
  confirm — otherwise your deploy hangs on a safety
  prompt, and somebody deletes the safety prompt to
  fix the deploy.`,
      codeExample: {
        title: "Interactive for humans, scriptable for cron",
        code: `<?php

namespace App\\Console\\Commands;

use App\\Services\\UserCreator;
use Illuminate\\Console\\Command;

use function Laravel\\Prompts\\{text, select, confirm, search};

class CreateUser extends Command
{
    // Options ARE the interface. Prompts fill the gaps.
    protected $signature = 'user:create
                            {--name=}
                            {--email=}
                            {--role=}
                            {--force : Skip confirmation}';

    public function handle(UserCreator $creator): int
    {
        $name = $this->option('name') ?? text(
            label: 'What is their name?',
            required: true,
        );

        $email = $this->option('email') ?? text(
            label: 'Email address?',
            validate: fn (string $value) => match (true) {
                ! filter_var($value, FILTER_VALIDATE_EMAIL) => 'Not a valid email.',
                User::where('email', $value)->exists()      => 'Already taken.',
                default                                     => null,
            },
        );

        // A select cannot produce an invalid value
        $role = $this->option('role') ?? select(
            label: 'Role?',
            options: ['member', 'manager', 'admin'],
            default: 'member',
        );

        $creator->create($name, $email, $role);

        $this->info("Created {$email} as {$role}.");

        return self::SUCCESS;
    }
}

// Human:  php artisan user:create
// Script: php artisan user:create --name=A --email=b@c.d --role=admin -n


<?php
// ---------- Destructive: safe default + --force ----------

class PurgeInvoices extends Command
{
    protected $signature = 'invoices:purge {--all} {--force}';

    public function handle(): int
    {
        $count = Invoice::draft()->count();

        // --force is what lets a deploy script run this.
        // Without it, the script hangs on the prompt — and
        // then somebody deletes the prompt to fix the deploy.
        if (! $this->option('force')) {
            $confirmed = confirm(
                label: "Delete {$count} draft invoices?",
                default: false,            // ← enter = No
            );

            if (! $confirmed) {
                $this->comment('Cancelled.');

                return self::SUCCESS;
            }
        }

        Invoice::draft()->delete();
        $this->info("Deleted {$count} invoices.");

        return self::SUCCESS;
    }
}


<?php
// ---------- search(): a large set, queried as you type ----------

$clientId = search(
    label: 'Which client?',
    placeholder: 'Start typing a name…',
    options: fn (string $value) => strlen($value) > 1
        ? Client::where('name', 'like', "%{$value}%")
            ->limit(10)
            ->pluck('name', 'id')
            ->all()
        : [],
);

// No select list of 10,000 clients, and the operator
// never needs to know the ID.


<?php
// ---------- Multi-select and password ----------

use function Laravel\\Prompts\\{multiselect, password};

$abilities = multiselect(
    label: 'Token abilities?',
    options: ['invoices:read', 'invoices:write', 'clients:read'],
    default: ['invoices:read'],
);

$secret = password(label: 'API key?');   // not echoed


<?php
// ---------- Guarding the no-TTY case explicitly ----------

public function handle(): int
{
    if (! $this->input->isInteractive() && ! $this->option('email')) {
        $this->error('--email is required when running non-interactively.');

        return self::INVALID;       // fails fast instead of hanging
    }

    // ...
}`,
      },
      keyTakeaways: [
        "<b>Prompts replaces a wall of required options</b> with questions a person can answer.",
        "<b>`select()` is safer than free text</b>, because an invalid value is not expressible.",
        "<b>`confirm()` on a destructive command must default to no</b>, since enter-without-reading is what happens.",
        "<b>`search()` queries as you type</b>, so a huge set needs no giant list and no IDs.",
        "<b>Every prompt takes `validate:`</b>, stopping bad input at the door.",
        "<b>Prompts need a TTY, and cron, CI and deploy scripts do not have one.</b>",
        "<b>A prompting command run by the scheduler hangs</b>, every night, waiting for an answer nobody types.",
        "<b>Make options the real interface and let prompts fill the gaps</b>, so one command serves humans and scripts.",
        "<b>`--force` must skip the confirmation</b>, or the deploy hangs and somebody removes the safety prompt.",
        "<b>Fail fast when non-interactive input is missing</b> rather than waiting on a prompt that cannot appear.",
      ],
      commonMistakes: [
        "<b>Scheduling a command that prompts.</b> It hangs nightly with no output anyone reads.",
        "<b>Defaulting a destructive confirm to yes.</b> Enter-without-reading then deletes the data.",
        "<b>Prompting with no option equivalent.</b> The command cannot be used from a script at all.",
        "<b>Building a select list from a huge table.</b> `search()` exists for exactly that.",
        "<b>Validating after the prompts.</b> The operator answers five questions before learning the second was wrong.",
      ],
      quiz: [
        {
          question: "Why is `select()` safer than asking for free text?",
          options: [
            "It is faster",
            "An invalid value is not expressible, so input that never had to be free-form cannot be wrong",
            "It validates automatically",
            "It works without a TTY",
          ],
          correctIndex: 1,
          explanation: "Free text accepts `prod`, `Production` and typos alike.",
        },
        {
          question: "What happens when the scheduler runs a command that prompts?",
          options: [
            "It uses defaults",
            "There is no TTY, so it hangs or throws, every run, with nobody watching",
            "It skips the prompt",
            "It fails with a clear error",
          ],
          correctIndex: 1,
          explanation: "Options must be able to supply everything the prompts ask for.",
        },
        {
          question: "Why should a destructive `confirm()` default to no?",
          options: [
            "Convention",
            "Enter-without-reading is what a tired person does, so the safe answer must be the default",
            "Laravel requires it",
            "It is faster",
          ],
          correctIndex: 1,
          explanation: "The default should be the outcome you can recover from.",
        },
        {
          question: "What is the pattern that makes a command work for both humans and scripts?",
          options: [
            "Two commands",
            "Options are the real interface, and prompts fill in what was not passed",
            "Always prompt",
            "Never prompt",
          ],
          correctIndex: 1,
          explanation: "`$this->option('name') ?? text(...)`.",
        },
      ],
    },
    {
      id: "output-progress-and-tables",
      title: "Output: spinners, progress bars, tables & exit codes",
      durationMinutes: 11,
      explanation: "A command that prints nothing looks identical to a command that has crashed.\n\n---\n\n### 1. Basic — the output levels\n\n```php\n$this->info('Import started.');\n$this->warn('3 records skipped.');\n$this->error('Import failed.');\n$this->line('Plain text.');\n$this->comment('Cancelled.');\n```\n\n```text\nINFO     Import started.\nWARNING  3 records skipped.\nERROR    Import failed.\n```\n\n<b>These are not just colours.</b> `error()` writes to <b>stderr</b>, the others to stdout, which is what lets a cron entry redirect real failures somewhere different from routine chatter, and what stops your error text being swallowed by a pipe.\n\n---\n\n### 2. Intermediate — spinner vs progress bar\n\nThe rule is simply <b>whether you know the total</b>:\n\n```text\nunknown duration  →  spinner    ⠋ Processing...\nknown total       →  progress   ████████░░░░ 80%\n```\n\n```php\n$result = spin(\n    callback: fn () => $api->fetchAll(),\n    message: 'Fetching from the API…',\n);\n\n$users = progress(\n    label: 'Processing users',\n    steps: User::all(),\n    callback: fn (User $user) => $this->process($user),\n);\n```\n\n<b>Without either, the operator's question is \"did it freeze?\"</b>, and the answer they act on is Ctrl-C, halfway through a job that was working.\n\n<b>And a progress bar over `all()` is a memory problem</b> the moment the table is large. Use `chunkById` or `cursor` and drive the bar manually, or you have taught the operator patience while running the machine out of RAM.\n\n---\n\n### 3. Advanced — tables and what \"done\" should say\n\n```php\n$this->table(\n    ['ID', 'Name', 'Email'],\n    User::limit(10)->get(['id', 'name', 'email'])->toArray(),\n);\n```\n\n```text\n+----+-------+-------------------+\n| ID | Name  | Email             |\n+----+-------+-------------------+\n| 1  | Rajan | rajan@example.com |\n+----+-------+-------------------+\n```\n\nBetter than concatenating strings, and it stays aligned when a value is long.\n\n<b>Now the part most commands get wrong: the summary.</b>\n\n```text\n❌ Done.\n✅ Processed 50 users. 47 updated, 3 skipped (missing email).\n```\n\n<b>\"Done\" is not a result, it is a reassurance.</b> The second line tells the operator whether to investigate, and it is what gets pasted into an incident channel. If the command skipped things, <b>say how many and why</b>, because a silent skip is a bug that hides for months.\n\nTwo more.\n\n<b>Respect verbosity.</b> `-v`, `-vv`, `-vvv` are what the operator turns on when something is wrong:\n\n```php\nif ($this->output->isVerbose()) {\n    $this->line(\"Skipped {$user->id}: no email\");\n}\n```\n\nPer-record output at normal verbosity buries the summary in ten thousand lines.\n\n<b>And what you print is not what your monitoring reads.</b> The exit code is. A command that prints `ERROR` in red and returns 0 is a green scheduled task with red text nobody is looking at.",
      diagram: `Output levels

    $this->info('Import started.');
    $this->warn('3 records skipped.');
    $this->error('Import failed.');
    $this->line('Plain text.');
    $this->comment('Cancelled.');

      INFO     Import started.
      WARNING  3 records skipped.
      ERROR    Import failed.

  Not just colours: error() writes to STDERR, the
  rest to stdout. That is what lets cron redirect
  real failures elsewhere, and stops your error text
  being swallowed by a pipe.


Spinner vs progress — do you know the total?

    unknown duration  →  spinner
                         ⠋ Processing...

    known total       →  progress bar
                         ████████░░░░ 80%

  Without either, the operator's question is
  "did it freeze?" — and the answer they act on is
  Ctrl-C, halfway through a job that was working.

  ⚠️  progress(steps: User::all()) loads the whole
      table. Use chunkById/cursor and advance the bar
      manually, or you have taught the operator
      patience while running the machine out of RAM.


Tables

    +----+-------+-------------------+
    | ID | Name  | Email             |
    +----+-------+-------------------+
    | 1  | Rajan | rajan@example.com |
    +----+-------+-------------------+

  Beats concatenating strings, and stays aligned when
  a value is long.


The summary most commands get wrong

    ❌  Done.

    ✅  Processed 50 users.
        47 updated, 3 skipped (missing email).

  "Done" is a reassurance, not a result.

  The second line tells the operator whether to
  investigate — and it is what gets pasted into an
  incident channel.

  If it skipped things, say HOW MANY and WHY. A
  silent skip is a bug that hides for months.


Verbosity

    -v  -vv  -vvv    what the operator turns on when
                     something is wrong

    if ($this->output->isVerbose()) {
        $this->line("Skipped {$user->id}: no email");
    }

  Per-record output at normal verbosity buries the
  summary under ten thousand lines.


  ⚠️  What you PRINT is not what monitoring READS.

      The exit code is. A command that prints ERROR
      in red and returns 0 is a green scheduled task
      with red text nobody is looking at.`,
      codeExample: {
        title: "Progress, tables and a summary worth reading",
        code: `<?php

use function Laravel\\Prompts\\{progress, spin, table};

class ProcessUsers extends Command
{
    protected $signature = 'users:process {--chunk=200}';

    public function handle(UserProcessor $processor): int
    {
        $total = User::pending()->count();

        if ($total === 0) {
            $this->info('Nothing to process.');

            return self::SUCCESS;
        }

        $updated = 0;
        $skipped = [];

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        // chunkById, not all() — the bar should not cost
        // you the whole table in memory
        User::pending()->chunkById((int) $this->option('chunk'), function ($users) use (&$updated, &$skipped, $bar) {
            foreach ($users as $user) {
                if (! $user->email) {
                    $skipped[] = $user;

                    // Per-record detail only when asked for it
                    if ($this->output->isVerbose()) {
                        $this->line("  skipped {$user->id}: no email");
                    }
                } else {
                    $this->processor->process($user);
                    $updated++;
                }

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine(2);

        // ❌ $this->info('Done.');
        // ✅ A result the operator can act on
        $this->info("Processed {$total} users. {$updated} updated, "
            . count($skipped) . ' skipped.');

        if ($skipped !== []) {
            $this->warn('Skipped users (missing email):');

            $this->table(
                ['ID', 'Name', 'Created'],
                collect($skipped)->take(10)->map(fn ($u) => [
                    $u->id, $u->name, $u->created_at->toDateString(),
                ])->all(),
            );

            return self::FAILURE;      // ← what monitoring reads
        }

        return self::SUCCESS;
    }
}


<?php
// ---------- Prompts' progress helper, for a bounded set ----------

$results = progress(
    label: 'Sending invoices',
    steps: $invoices,                    // already in memory
    callback: fn (Invoice $invoice) => $this->sender->send($invoice),
);


<?php
// ---------- spin(): duration unknown ----------

$response = spin(
    callback: fn () => Http::timeout(120)->get($endpoint),
    message: 'Waiting for the export to build…',
);

// Without it: a blank terminal, and an operator who
// hits Ctrl-C on a job that was working fine.


<?php
// ---------- stdout vs stderr ----------

$this->info('Routine progress.');    // stdout
$this->error('Real failure.');       // stderr

// crontab:
// 0 2 * * * php artisan users:process >> /var/log/users.log 2>> /var/log/users.err
//
// Failures land somewhere you can alert on, separately
// from the nightly chatter.


<?php
// ---------- Verbosity levels ----------

$this->output->isQuiet();        // -q
$this->output->isVerbose();      // -v
$this->output->isVeryVerbose();  // -vv
$this->output->isDebug();        // -vvv

// Or let Laravel do it:
$this->line('detail', verbosity: OutputInterface::VERBOSITY_VERBOSE);`,
      },
      keyTakeaways: [
        "<b>`info`, `warn`, `error`, `line` and `comment` are the output levels</b>, and `error` writes to stderr.",
        "<b>That split lets cron alert on real failures</b> separately from routine output.",
        "<b>Spinner when the duration is unknown, progress bar when you know the total.</b>",
        "<b>Without either, the operator assumes it froze</b> and hits Ctrl-C on a working job.",
        "<b>Do not build a progress bar over `all()`</b>: use `chunkById` or `cursor` and advance manually.",
        "<b>`$this->table()` keeps structured output aligned</b>, unlike concatenated strings.",
        "<b>\"Done\" is a reassurance, not a result.</b> Print counts and reasons.",
        "<b>Always report what was skipped and why</b>, because a silent skip hides for months.",
        "<b>Put per-record detail behind `-v`</b>, or the summary drowns in ten thousand lines.",
        "<b>Monitoring reads the exit code, not your text</b>, so red output with exit `0` is a green task.",
      ],
      commonMistakes: [
        "<b>A long command with no output.</b> Indistinguishable from a hang, and it gets killed.",
        "<b>`progress(steps: Model::all())` on a large table.</b> You bought a nice bar with all your memory.",
        "<b>Ending with `Done.`</b> The operator learns nothing and has nothing to paste anywhere.",
        "<b>Printing a line per record at normal verbosity.</b> The summary is now unfindable.",
        "<b>Printing an error and returning 0.</b> Monitoring sees a successful run.",
      ],
      quiz: [
        {
          question: "Why does it matter that `error()` writes to stderr?",
          options: [
            "It is faster",
            "Cron and CI can route real failures separately from routine output, and pipes will not swallow it",
            "It shows in red",
            "It stops the command",
          ],
          correctIndex: 1,
          explanation: "Stream choice is what alerting hooks into.",
        },
        {
          question: "When is a spinner the right choice over a progress bar?",
          options: [
            "Always",
            "When you do not know the total amount of work, only that something is happening",
            "For short commands",
            "For destructive commands",
          ],
          correctIndex: 1,
          explanation: "Known total means a progress bar.",
        },
        {
          question: "What is wrong with `progress(steps: User::all())`?",
          options: [
            "Nothing",
            "It loads the whole table into memory, so the bar costs you RAM proportional to the data",
            "The bar is inaccurate",
            "It cannot show a label",
          ],
          correctIndex: 1,
          explanation: "Chunk and advance the bar manually.",
        },
        {
          question: "Why is `Done.` a poor final message?",
          options: [
            "It is too short",
            "It gives the operator nothing to act on: no counts, no skips, no reasons",
            "It is not coloured",
            "It should be a table",
          ],
          correctIndex: 1,
          explanation: "A silent skip is a bug that hides for months.",
        },
      ],
    },
    {
      id: "isolatable-and-scheduled-commands",
      title: "Isolatable commands & scheduling",
      durationMinutes: 11,
      explanation: "A command that is safe to run once is not automatically safe to run twice at the same time.\n\n---\n\n### 1. Basic — the overlap problem\n\n```text\nServer A → reports:generate\nServer B → reports:generate\n```\n\nBoth start the same expensive job. Depending on what it does, you get double emails, double charges, duplicate rows, or two processes fighting over the same records.\n\n<b>And this is not hypothetical the moment you have two application servers</b>, because most people put the same crontab on both.\n\nThe fix:\n\n```php\nclass GenerateReports extends Command implements Isolatable\n{\n    // ...\n}\n```\n\n```bash\nphp artisan reports:generate --isolated\n```\n\n```text\ncommand starts → acquire lock → another instance? → blocked\n```\n\nThe lock lives in your <b>cache</b>, so it works across servers only if the cache is shared. <b>A file or array cache driver gives each server its own lock and no protection at all</b>, which is the quiet way this fails.\n\n---\n\n### 2. Intermediate — what to isolate\n\n```text\nimports · reports · billing · data sync · cleanup\n```\n\nThe test: <b>would running this twice concurrently be wrong?</b> If yes, isolate it.\n\nAnd choose the exit behaviour deliberately:\n\n```bash\n--isolated          exits 0 when already running\n--isolated=1        exits 1 instead\n```\n\n<b>Exit 0 is right for a scheduled task</b>, where \"the previous run is still going\" is normal and should not page anyone. <b>Exit 1 is right in a deploy script</b>, where you need to know the migration you asked for did not happen.\n\n---\n\n### 3. Advanced — scheduling, and the two ways this bites\n\nDay 27 covered the scheduler. The joins are:\n\n```text\nSchedule → Artisan command → Service → Job → Queue\n```\n\n```php\nSchedule::command('reports:generate')\n    ->dailyAt('02:00')\n    ->withoutOverlapping()\n    ->onOneServer()\n    ->emailOutputOnFailure('ops@example.com');\n```\n\n<b>`withoutOverlapping()` and `onOneServer()` solve two different problems</b>, and people reach for one thinking it does both:\n\n```text\nwithoutOverlapping()  the same server, run overlapping runs\nonOneServer()         several servers, all firing at 02:00\n```\n\n<b>You usually want both</b>, and `onOneServer()` also needs a shared cache.\n\nAnd the trap that outlives all of this: <b>`withoutOverlapping()` has a default expiry of 24 hours.</b> If a run is killed without releasing its lock, the task does not run again until that expires. The symptom is a report that stopped arriving a day ago and a scheduler that looks perfectly healthy. Set an expiry matching how long the task should ever take:\n\n```php\n->withoutOverlapping(30)   // minutes\n```\n\n<b>The last piece is that a command's exit code is what the scheduler acts on</b>, which is where Day 29 and lesson 2 meet: `emailOutputOnFailure` and `pingOnFailure` only fire on a non-zero exit. A command that catches everything and returns `self::SUCCESS` is a scheduled task that can never alert.",
      diagram: `The overlap problem

    Server A → reports:generate
    Server B → reports:generate

  Both start the same expensive job:
    double emails · double charges · duplicate rows
    two processes fighting over the same records

  Not hypothetical the moment you have two app
  servers — most people put the same crontab on both.


Isolatable

    class GenerateReports extends Command
        implements Isolatable

    php artisan reports:generate --isolated

    command starts → acquire lock
                   → another instance? → BLOCKED

  ⚠️  The lock lives in your CACHE.

      A file or array driver gives each server its
      OWN lock, and therefore no protection. That is
      the quiet way this fails.

  Exit behaviour, chosen deliberately:

    --isolated      exits 0 when already running
                    → right for a SCHEDULED task
                      ("still going" should not page)

    --isolated=1    exits 1 instead
                    → right in a DEPLOY script
                      (you need to know it didn't run)

  What to isolate — would running this twice
  concurrently be WRONG?

    imports · reports · billing · sync · cleanup


Scheduling

    Schedule → Artisan command → Service → Job → Queue

    Schedule::command('reports:generate')
        ->dailyAt('02:00')
        ->withoutOverlapping(30)
        ->onOneServer()
        ->emailOutputOnFailure('ops@example.com');


Two different problems, often confused

    withoutOverlapping()   the SAME server, runs
                           overlapping in time

    onOneServer()          SEVERAL servers all firing
                           at 02:00

    You usually want both. onOneServer() also needs a
    shared cache.


  ⚠️  withoutOverlapping() defaults to a 24-HOUR expiry.

      A run killed without releasing its lock blocks
      the task for a day.

      Symptom: a report that stopped arriving
      yesterday, and a scheduler that looks perfectly
      healthy.

        ->withoutOverlapping(30)   ← minutes


  The exit code is what the scheduler ACTS on.

    emailOutputOnFailure / pingOnFailure fire only on
    a NON-ZERO exit.

    A command that catches everything and returns
    SUCCESS can never alert.`,
      codeExample: {
        title: "Isolation, scheduling and the locks that bite",
        code: `<?php

namespace App\\Console\\Commands;

use Illuminate\\Console\\Command;
use Illuminate\\Contracts\\Console\\Isolatable;

class GenerateReports extends Command implements Isolatable
{
    protected $signature = 'reports:generate {--month=}';

    // How long the lock survives if this process is killed
    public function isolationLockExpiresAt(): DateTimeInterface
    {
        return now()->addMinutes(30);
    }

    public function handle(ReportBuilder $builder): int
    {
        $result = $builder->buildFor($this->option('month') ?? now()->subMonth());

        $this->info("Built {$result->count} reports.");

        return $result->failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}

// php artisan reports:generate --isolated     exits 0 if running
// php artisan reports:generate --isolated=1   exits 1 if running


<?php
// ---------- routes/console.php ----------

use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('reports:generate')
    ->dailyAt('02:00')
    ->withoutOverlapping(30)              // ← minutes, not the 24h default
    ->onOneServer()                       // ← needs a shared cache
    ->emailOutputOnFailure('ops@example.com');

// withoutOverlapping()  same server, runs overlapping in time
// onOneServer()         several servers firing at 02:00
//
// They solve different problems. You usually want both.


<?php
// ---------- The 24-hour lock, and its symptom ----------

// ❌ Default expiry
Schedule::command('invoices:sync')->hourly()->withoutOverlapping();
//
// The 03:00 run is OOM-killed. The lock is never
// released. The task does not run again until 03:00
// TOMORROW — and the scheduler reports no errors,
// because it never tried.

// ✅ Expiry matched to how long the task should ever take
Schedule::command('invoices:sync')->hourly()->withoutOverlapping(50);


# ---------- Why the cache driver decides whether this works ----------

# .env on server A and server B
CACHE_STORE=file        # ❌ each server has its own lock → no protection
CACHE_STORE=redis       # ✅ one shared lock

# Same for onOneServer(). Silent failure either way:
# nothing errors, both servers just run.


<?php
// ---------- Failure has to be visible ----------

// ❌ Nothing can ever alert on this
public function handle(): int
{
    try {
        $this->builder->build();
    } catch (Throwable $e) {
        report($e);
        $this->error('Failed.');
    }

    return self::SUCCESS;      // ← scheduler sees success
}

// ✅
public function handle(): int
{
    try {
        $this->builder->build();
    } catch (Throwable $e) {
        report($e);
        $this->error("Failed: {$e->getMessage()}");

        return self::FAILURE;
    }

    return self::SUCCESS;
}

Schedule::command('reports:generate')
    ->dailyAt('02:00')
    ->pingOnFailure('https://healthchecks.io/ping/xxx/fail');


<?php
// ---------- Seeing what is actually scheduled ----------

// php artisan schedule:list
// php artisan schedule:test          run one task interactively
// php artisan schedule:work          run the scheduler locally`,
      },
      keyTakeaways: [
        "<b>Two servers with the same crontab run the same command twice</b>, at the same moment.",
        "<b>`Isolatable` plus `--isolated` takes a lock</b> so a second instance is blocked.",
        "<b>The lock lives in the cache</b>, so a file or array driver gives each server its own and protects nothing.",
        "<b>`--isolated` exits 0 when blocked, `--isolated=1` exits 1</b>: scheduled tasks want the first, deploys the second.",
        "<b>Isolate anything where running twice concurrently would be wrong</b>: imports, reports, billing, sync, cleanup.",
        "<b>`withoutOverlapping()` guards runs overlapping in time on one server.</b>",
        "<b>`onOneServer()` guards several servers firing the same schedule</b>, and also needs a shared cache.",
        "<b>`withoutOverlapping()` defaults to a 24-hour expiry</b>, so a killed run blocks the task for a day.",
        "<b>The symptom is a task that quietly stopped</b> while the scheduler reports no errors.",
        "<b>The scheduler acts on the exit code</b>, so a command that catches everything and returns success can never alert.",
      ],
      commonMistakes: [
        "<b>Assuming one crontab.</b> Two app servers means two runs unless you say otherwise.",
        "<b>Using `onOneServer()` with a file cache.</b> No shared lock, no protection, and no error.",
        "<b>Leaving `withoutOverlapping()` at its default expiry.</b> One killed run silences the task for 24 hours.",
        "<b>Thinking `withoutOverlapping()` covers multiple servers.</b> That is `onOneServer()`.",
        "<b>Swallowing exceptions and returning success.</b> `emailOutputOnFailure` never fires.",
      ],
      quiz: [
        {
          question: "Where does an isolation lock live, and why does that matter?",
          options: [
            "In the database",
            "In the cache, so a file or array driver gives each server its own lock and no protection",
            "In a lock file on disk, shared automatically",
            "In the session",
          ],
          correctIndex: 1,
          explanation: "Cross-server isolation requires a shared cache like Redis.",
        },
        {
          question: "What is the difference between `withoutOverlapping()` and `onOneServer()`?",
          options: [
            "They are the same",
            "The first stops runs overlapping in time on one server; the second stops several servers running the same schedule",
            "The first is for queues",
            "The second is deprecated",
          ],
          correctIndex: 1,
          explanation: "Different problems, and you usually want both.",
        },
        {
          question: "What happens when a task with default `withoutOverlapping()` is killed mid-run?",
          options: [
            "The lock releases immediately",
            "The lock survives for 24 hours, so the task silently does not run again until it expires",
            "The scheduler reports an error",
            "The next run kills the lock",
          ],
          correctIndex: 1,
          explanation: "Pass an expiry in minutes that matches the task's realistic maximum.",
        },
        {
          question: "Why can a scheduled command that catches every exception never alert?",
          options: [
            "Exceptions are not logged",
            "`emailOutputOnFailure` and `pingOnFailure` fire only on a non-zero exit code",
            "The scheduler ignores output",
            "It does alert",
          ],
          correctIndex: 1,
          explanation: "Return `self::FAILURE` after reporting the error.",
        },
      ],
    },
    {
      id: "pint-and-code-style",
      title: "Pint & automating code style",
      durationMinutes: 11,
      explanation: "The cheapest quality win in a codebase, and the one teams argue about longest.\n\n---\n\n### 1. Basic — what Pint is\n\n<b>Laravel Pint</b> is an opinionated PHP code-style fixer built on PHP-CS-Fixer, shipped with Laravel:\n\n```bash\n./vendor/bin/pint\n```\n\nIt rewrites your files: spacing, braces, import ordering, trailing commas, alignment. <b>Not a linter that complains, a fixer that fixes.</b> Which matters, because a tool that only reports style problems creates a chore, and a tool that fixes them creates a habit.\n\n```bash\n./vendor/bin/pint --test    # report, change nothing (CI)\n./vendor/bin/pint --dirty   # only files changed in git\n./vendor/bin/pint -v        # show what rules fired\n```\n\n---\n\n### 2. Intermediate — why this is worth automating\n\nFive developers, five habits:\n\n```text\ndifferent indentation · different spacing · different conventions\n```\n\n```text\nDeveloper A ─┐\nDeveloper B ─┼→ Pint → consistent code\nDeveloper C ─┘\n```\n\n<b>The real cost is not ugliness, it is diff noise.</b> A pull request where twelve of fifteen changed lines are whitespace is a pull request nobody reviews properly, and the one real change is hiding in it. <b>Reviewers have a fixed budget of attention</b>, and style burns it before they reach anything that matters.\n\nThe principle:\n\n> <b>Code style should be automated, not debated in every PR.</b>\n\nAnd it holds even if you dislike a specific rule. <b>A consistent style you mildly disagree with beats an inconsistent one you chose</b>, because the value is in the consistency, not the choices.\n\n---\n\n### 3. Advanced — where to run it, and the trap\n\nConfigure a preset in `pint.json`:\n\n```json\n{ \"preset\": \"laravel\" }\n```\n\n<b>Pick the preset once, early, and stop.</b> Changing it later rewrites every file, and now `git blame` on your whole codebase points at one style commit. If you must, do it in a single commit that touches nothing else, and add it to `.git-blame-ignore-revs`.\n\nWhere to run it, in order of how much friction each adds:\n\n```text\neditor on save     zero friction, per-developer\npre-commit hook    catches it before it exists\nCI --test          the only one that is enforcement\n```\n\n<b>CI is the one that actually holds</b>, because hooks are local and someone always has them off. But a CI check with no local fixer is a bad trade: the feedback arrives minutes later, on a build, for something the developer could have fixed in a keystroke.\n\n<b>The trap: introducing Pint to an existing codebase.</b> Running it across everything produces a diff of thousands of lines that will conflict with every open branch and destroy `git blame`. Better: `pint --dirty` in CI so only <b>changed</b> files must be clean, and the codebase converges as it is touched.\n\nAnd the boundary worth naming: <b>Pint formats, it does not find bugs.</b> Static analysis (PHPStan, Larastan) is the tool for \"this method can return null and you did not check\". Different job, and the one that catches the thing Pint never will.",
      diagram: `What Pint is

    ./vendor/bin/pint

  An opinionated fixer built on PHP-CS-Fixer, shipped
  with Laravel. It REWRITES files: spacing, braces,
  import order, trailing commas, alignment.

  Not a linter that complains. A fixer that fixes.

    a tool that REPORTS style problems → a chore
    a tool that FIXES them             → a habit

    ./vendor/bin/pint --test    report only (CI)
    ./vendor/bin/pint --dirty   changed files only
    ./vendor/bin/pint -v        show which rules fired


Why automate it

    Developer A ─┐
    Developer B ─┼→  Pint  →  consistent code
    Developer C ─┘

  The real cost is not ugliness. It is DIFF NOISE.

    a PR where 12 of 15 changed lines are whitespace
      ↓
    nobody reviews it properly
      ↓
    the one real change is hiding in it

  Reviewers have a fixed budget of attention, and
  style burns it before they reach anything important.

    Code style should be AUTOMATED, not debated in
    every PR.

  Holds even for rules you dislike: a consistent style
  you mildly disagree with beats an inconsistent one
  you chose. The value is the consistency.


Where to run it

    editor on save    zero friction, per-developer
    pre-commit hook   catches it before it exists
    CI --test         the only one that is ENFORCEMENT

  CI is what holds — hooks are local and someone
  always has them off.

  But CI with no local fixer is a bad trade: feedback
  arrives minutes later, on a build, for something a
  keystroke would have fixed.


  ⚠️  Introducing Pint to an existing codebase.

      Running it over everything:
        a thousand-line diff
        conflicts with every open branch
        git blame points at one style commit

      Better: pint --dirty in CI. Only CHANGED files
      must be clean, and the codebase converges as it
      is touched.

      Same for changing the preset later — one commit
      that touches nothing else, added to
      .git-blame-ignore-revs.


The boundary

    Pint             formats
    PHPStan/Larastan finds bugs

    "this method can return null and you did not
     check" is not a style problem, and Pint will
     never see it.`,
      codeExample: {
        title: "Pint locally, in hooks and in CI",
        code: `# ---------- The commands ----------

./vendor/bin/pint                 # fix everything
./vendor/bin/pint --test          # report only, exit 1 if dirty
./vendor/bin/pint --dirty         # only files changed vs git
./vendor/bin/pint -v              # which rules fired, per file
./vendor/bin/pint app/Services    # a path


# ---------- pint.json: pick a preset once ----------

{
    "preset": "laravel",
    "rules": {
        "declare_strict_types": true,
        "ordered_imports": { "sort_algorithm": "alpha" },
        "no_unused_imports": true
    },
    "exclude": ["database/migrations"]
}

# Changing the preset later rewrites every file and
# points git blame at one commit. If you must:
#   one commit, nothing else in it, then
#   echo <sha> >> .git-blame-ignore-revs


# ---------- composer.json: make it discoverable ----------

"scripts": {
    "lint":     "pint",
    "lint:test": "pint --test",
    "check":    ["@lint:test", "@php artisan test"]
}

# composer check — one command a new developer can find


# ---------- Pre-commit hook (.git/hooks/pre-commit) ----------

#!/bin/sh
./vendor/bin/pint --dirty
git add $(git diff --name-only --cached --diff-filter=ACM | grep '\\.php$')

# Local, so someone always has it off. Convenience,
# not enforcement.


# ---------- CI: the part that actually holds ----------

# .github/workflows/ci.yml
- name: Check code style
  run: ./vendor/bin/pint --test --dirty

- name: Static analysis
  run: ./vendor/bin/phpstan analyse

- name: Tests
  run: php artisan test

# --dirty in CI is what lets you adopt Pint on an
# existing codebase without a thousand-line diff:
# only files this PR touched have to be clean.


# ---------- Different jobs ----------

# Pint     → formatting
#   spacing, braces, import order, trailing commas
#
# PHPStan  → correctness
#   "getUser() can return null and line 42 calls ->name on it"
#
# Tests    → behaviour
#   "an unauthorised user cannot delete this invoice"
#
# Three tools, three questions. None substitutes for
# another.


<?php
// ---------- What Pint will never catch ----------

public function ownerName(Invoice $invoice): string
{
    return $invoice->user->name;      // user() can be null
}

// Perfectly formatted. Fatal in production.
// That is PHPStan's job, not Pint's.`,
      },
      keyTakeaways: [
        "<b>Pint is a fixer, not a linter</b>, and that difference turns a chore into a habit.",
        "<b>`--test` reports without changing, `--dirty` limits to files changed in git.</b>",
        "<b>The real cost of inconsistent style is diff noise</b>, not ugliness.",
        "<b>A PR that is mostly whitespace does not get reviewed properly</b>, and reviewer attention is finite.",
        "<b>Style should be automated, not debated in every PR.</b>",
        "<b>A consistent style you mildly dislike beats an inconsistent one you chose</b>, because consistency is the value.",
        "<b>Pick a preset once and early</b>, since changing it rewrites every file and wrecks `git blame`.",
        "<b>Editor on save, pre-commit hook, CI `--test`</b>, in increasing order of enforcement.",
        "<b>CI is the only real enforcement</b>, but CI without a local fixer wastes minutes on a keystroke fix.",
        "<b>Use `--dirty` to adopt Pint on an existing codebase</b> so it converges instead of exploding.",
        "<b>Pint formats; PHPStan finds bugs.</b> Perfectly formatted code can still be fatally wrong.",
      ],
      commonMistakes: [
        "<b>Running Pint over an old codebase in one go.</b> Every open branch conflicts and blame is destroyed.",
        "<b>Debating style rules in code review.</b> That is what the preset is for.",
        "<b>CI style checks with no local fixer.</b> The feedback loop is minutes instead of instant.",
        "<b>Changing the preset casually.</b> One commit rewrites the entire history's blame.",
        "<b>Expecting Pint to catch bugs.</b> Formatting and correctness are different tools.",
      ],
      quiz: [
        {
          question: "What is the practical cost of inconsistent code style?",
          options: [
            "It looks bad",
            "Diff noise: a PR that is mostly whitespace does not get reviewed properly",
            "Slower execution",
            "Merge conflicts only",
          ],
          correctIndex: 1,
          explanation: "Reviewer attention is finite and style spends it first.",
        },
        {
          question: "How should you introduce Pint to an existing codebase?",
          options: [
            "Run it over everything in one commit",
            "Use `--dirty` so only changed files must be clean, letting the codebase converge",
            "Skip CI enforcement",
            "Write a custom preset",
          ],
          correctIndex: 1,
          explanation: "A full run conflicts with every open branch and destroys `git blame`.",
        },
        {
          question: "Why is a pre-commit hook not enforcement?",
          options: [
            "It is too slow",
            "Hooks are local, and someone always has them disabled",
            "It cannot run Pint",
            "It only runs on staged files",
          ],
          correctIndex: 1,
          explanation: "CI running `pint --test` is the check that actually holds.",
        },
        {
          question: "What does Pint not do?",
          options: [
            "Fix spacing",
            "Find bugs, such as a method returning null that the caller does not check",
            "Order imports",
            "Run in CI",
          ],
          correctIndex: 1,
          explanation: "That is static analysis: PHPStan or Larastan.",
        },
      ],
    },
    {
      id: "telescope-pulse-nightwatch",
      title: "Telescope, Pulse & Nightwatch — seeing inside",
      durationMinutes: 13,
      explanation: "Three tools that answer three different questions, and the names do not tell you which is which.\n\n```text\nTelescope   → detailed debugging, locally\nPulse       → application health, at a glance\nNightwatch  → monitoring and observability, in production\n```\n\n---\n\n### 1. Basic — Telescope\n\n<b>Telescope</b> records what happens inside a request and shows it to you:\n\n```text\nrequests · queries · jobs · mail · notifications\nexceptions · cache · events · commands · logs\n```\n\nInstead of \"something is slow\", you get:\n\n```text\nGET /dashboard\n  Query 1\n  Query 2\n  ...\n  Query 101\n```\n\n<b>And you have seen that number before.</b> That is the N+1 from Day 15, and Telescope is where you actually notice it, because 101 queries and 3 queries look identical from the browser.\n\nThe other two payoffs:\n\n<b>Jobs.</b> Dispatched, processing, completed, failed, with the payload and the exception. Queue debugging without it is reading log lines and guessing.\n\n<b>Mail.</b> Instead of \"did that actually send?\", you open the entry and read the rendered email. Invaluable while building mailables, notifications, password resets and verification flows.\n\n---\n\n### 2. Intermediate — the production warning\n\n<b>Telescope is a local development tool.</b> It records everything, which means:\n\n```text\nevery request → rows in the database\nevery query   → rows in the database\nevery job     → rows in the database\n```\n\nOn a busy production app that is enormous write volume and a table that grows without limit. <b>And it records request payloads</b>, so your Telescope database now contains passwords, tokens and personal data with a UI in front of it.\n\nIf you run it in production at all: restrict the gate to specific users, sample rather than record everything, prune aggressively, and never expose it publicly. <b>The common outcome of ignoring this is a Telescope table larger than the entire application database.</b>\n\n---\n\n### 3. Advanced — Pulse, Nightwatch and the real distinction\n\n<b>Pulse</b> is health at a glance, and it is safe in production because it aggregates rather than records: slow queries, slow jobs, slow routes, busiest users, cache hit rates, queue depth.\n\n```text\nTelescope  one request, in full detail\nPulse      all requests, summarised\n```\n\n<b>Nightwatch</b> is monitoring and observability: the layer that tells you something is wrong before a user does, and keeps history so you can ask what changed.\n\nThe progression is really about a change in your relationship to the app:\n\n```text\n\"I am building this\"        → Telescope\n\"is it healthy right now?\"  → Pulse\n\"people depend on this\"     → Nightwatch\n```\n\n<b>And the honest summary of all three: none of them is alerting.</b> A dashboard tells you what happened when you look at it, and nobody is looking at 3am. <b>The thing that wakes somebody up is a monitor with a threshold</b>, and the thing that tells you what broke is these tools, afterwards.\n\nSo the useful pairing is: <b>alerting says something is wrong, observability says what.</b> Teams that buy only the second one find out from their customers.",
      diagram: `Three tools, three questions

    Telescope    detailed debugging, LOCALLY
    Pulse        application health, at a glance
    Nightwatch   monitoring / observability, PRODUCTION


Telescope — what it records

    requests · queries · jobs · mail · notifications
    exceptions · cache · events · commands · logs

  Instead of "something is slow":

    GET /dashboard
      Query 1
      Query 2
      ...
      Query 101      ← the N+1 from Day 15

  101 queries and 3 queries look IDENTICAL from the
  browser. This is where you notice.

  Jobs      dispatched → processing → completed/failed
            with payload and exception

  Mail      stop wondering "did that send?" — open it
            and read the rendered email

            mailables · notifications · password
            resets · verification


  ⚠️  Telescope is a LOCAL tool.

      every request  → rows in the database
      every query    → rows in the database
      every job      → rows in the database

      On a busy app: enormous write volume and a table
      that grows without limit.

      And it records REQUEST PAYLOADS — so the
      Telescope database now holds passwords, tokens
      and personal data, with a UI in front of it.

      If you run it in production: gate it to named
      users, sample, prune aggressively, never expose
      it publicly.

      The common outcome of ignoring this is a
      Telescope table bigger than the entire
      application database.


Pulse — aggregate, so it is production-safe

    slow queries · slow jobs · slow routes
    busiest users · cache hit rate · queue depth

    Telescope   ONE request, in full detail
    Pulse       ALL requests, summarised


Nightwatch — monitoring and observability

  Tells you something is wrong before a user does,
  and keeps history so you can ask what changed.


The progression is about your relationship to the app

    "I am building this"        →  Telescope
    "is it healthy right now?"  →  Pulse
    "people depend on this"     →  Nightwatch


  ⚠️  None of these is ALERTING.

      A dashboard tells you what happened WHEN YOU
      LOOK, and nobody is looking at 3am.

        alerting        → something is wrong
        observability   → what is wrong

      Teams that buy only the second one find out
      from their customers.`,
      codeExample: {
        title: "Installing, gating and pruning",
        code: `# ---------- Telescope: local only ----------

composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# --dev matters. In composer.json:
#   "extra": { "laravel": { "dont-discover": ["laravel/telescope"] } }
# then register it only in AppServiceProvider when local.


<?php
// app/Providers/AppServiceProvider.php

public function register(): void
{
    if ($this->app->environment('local')) {
        $this->app->register(TelescopeServiceProvider::class);
    }
}


<?php
// app/Providers/TelescopeServiceProvider.php

public function boot(): void
{
    // If you DO run it in production, this is the line
    // that stands between a debugger and a data leak
    Gate::define('viewTelescope', fn ($user) => in_array($user->email, [
        'rajan@example.com',
    ]));

    // Sample instead of recording everything
    Telescope::filter(function (IncomingEntry $entry) {
        if ($this->app->environment('local')) {
            return true;
        }

        return $entry->isReportableException()
            || $entry->isFailedRequest()
            || $entry->isFailedJob()
            || $entry->isSlowQuery();
    });

    // Never store these
    Telescope::hideRequestParameters(['_token', 'password', 'password_confirmation']);
    Telescope::hideRequestHeaders(['authorization', 'cookie', 'x-api-key']);
}


# ---------- Pruning is not optional ----------

php artisan telescope:prune                 # older than 24h
php artisan telescope:prune --hours=48

# routes/console.php
Schedule::command('telescope:prune --hours=48')->daily();


<?php
// ---------- Finding the N+1 with Telescope, then fixing it ----------

// Telescope shows: GET /dashboard — 101 queries
foreach (Invoice::all() as $invoice) {
    echo $invoice->client->name;      // 1 + 100
}

// Fixed — Telescope now shows 2
foreach (Invoice::with('client')->get() as $invoice) {
    echo $invoice->client->name;
}

// And make it impossible to reintroduce (Day 15):
// AppServiceProvider::boot()
Model::preventLazyLoading(! $this->app->isProduction());


# ---------- Pulse: aggregate, safe in production ----------

composer require laravel/pulse
php artisan pulse:install
php artisan migrate

# config/pulse.php — recorders you care about
# Slow queries, slow jobs, slow requests, queue depth,
# cache hits, exceptions, user activity.


<?php
// Gate Pulse too — it shows your slowest queries and
// busiest users
Gate::define('viewPulse', fn ($user) => $user->isAdmin());

// Ignore noise so the dashboard stays readable
'recorders' => [
    SlowQueries::class => [
        'threshold' => 500,          // ms
        'ignore'    => ['/telescope_entries/'],
    ],
],


# ---------- Where the boundary is ----------

# Telescope   one request, everything about it
# Pulse       all requests, summarised
# Nightwatch  history, trends, and knowing before a user tells you
#
# None of them pages anybody. That is a monitor with a
# threshold — a healthcheck ping, an uptime service, an
# alert rule:

Schedule::command('reports:generate')
    ->dailyAt('02:00')
    ->pingOnFailure('https://healthchecks.io/ping/xxx/fail');`,
      },
      keyTakeaways: [
        "<b>Telescope is detailed local debugging</b>: requests, queries, jobs, mail, exceptions, cache, logs.",
        "<b>It is where you actually see an N+1</b>, because 101 queries look the same as 3 from the browser.",
        "<b>Its job and mail panels are the payoff</b> when building queues, mailables and verification flows.",
        "<b>Telescope records everything</b>, so on a busy app it is huge write volume and unbounded growth.",
        "<b>It also records request payloads</b>, meaning passwords and tokens land in a database with a UI.",
        "<b>If you run it in production: gate it, filter it, hide sensitive parameters and prune on a schedule.</b>",
        "<b>Pulse aggregates rather than records</b>, which is what makes it production-safe.",
        "<b>Telescope is one request in detail; Pulse is all requests summarised.</b>",
        "<b>Nightwatch is monitoring and observability</b>, for when people depend on the application.",
        "<b>None of the three is alerting.</b> A dashboard only tells you something when you look at it.",
        "<b>Alerting says something is wrong; observability says what.</b> You need both.",
      ],
      commonMistakes: [
        "<b>Leaving Telescope enabled in production unfiltered.</b> The entries table outgrows the application database.",
        "<b>Not hiding request parameters.</b> Passwords and API keys sit in a browsable UI.",
        "<b>Never pruning.</b> Growth is unbounded and eventually the disk decides for you.",
        "<b>Treating a dashboard as alerting.</b> Nobody is looking at 3am.",
        "<b>Using Pulse to debug one request.</b> It aggregates; Telescope is the detail view.",
      ],
      quiz: [
        {
          question: "What makes Telescope dangerous in production?",
          options: [
            "It is slow to load",
            "It records everything including request payloads, so growth is unbounded and secrets land in a browsable UI",
            "It requires Redis",
            "It disables the queue",
          ],
          correctIndex: 1,
          explanation: "Gate it, filter it, hide parameters and prune on a schedule.",
        },
        {
          question: "What is the difference between Telescope and Pulse?",
          options: [
            "Pulse is newer",
            "Telescope shows one request in full detail; Pulse aggregates all requests into health metrics",
            "Pulse is local only",
            "They are the same tool",
          ],
          correctIndex: 1,
          explanation: "Aggregation is what makes Pulse production-safe.",
        },
        {
          question: "Which problem does Telescope make obvious that a browser never will?",
          options: [
            "A 500 error",
            "An N+1, because 101 queries and 3 queries look identical from the outside",
            "A missing route",
            "A CSS bug",
          ],
          correctIndex: 1,
          explanation: "Then `preventLazyLoading` stops it coming back.",
        },
        {
          question: "Why is none of these three tools a replacement for alerting?",
          options: [
            "They are too slow",
            "A dashboard only tells you something when you look at it, and nobody is looking at 3am",
            "They do not record errors",
            "They only work locally",
          ],
          correctIndex: 1,
          explanation: "Alerting says something is wrong; observability says what.",
        },
      ],
    },
    {
      id: "boost-envoy-pennant-and-the-map",
      title: "Boost, Envoy, Pennant & where everything belongs",
      durationMinutes: 13,
      explanation: "Three more tools, and then the map that ties the whole day together.\n\n---\n\n### 1. Basic — Boost and MCP\n\n<b>Laravel Boost</b> gives AI coding agents Laravel-aware context and tools. <b>MCP</b> is the standard protocol those agents use to talk to tools.\n\n```text\nold:      developer → read docs → search code → write code\nagentic:  developer → agent → Laravel-aware tools →\n          inspect → modify → test\n```\n\nThe shift is that the agent can <b>look at your actual application</b> rather than guessing from training data: your routes, your schema, your installed version.\n\n<b>And the skill is not \"let AI write everything\".</b> It is giving the agent enough project context and enough constraints that its changes are safe. The engineer still owns architecture, security, correctness, testing and trade-offs. <b>Generated code needs the same review and the same tests as any other code</b>, and Day 29 is what makes reviewing it tractable: a suite that goes red is worth more than a careful read of a diff you did not write.\n\n---\n\n### 2. Intermediate — Envoy and Pennant\n\n<b>Envoy</b> runs tasks on remote servers over SSH:\n\n```text\nlocal machine → Envoy → SSH → server → commands\n```\n\nDeploys, restarting workers, clearing caches, running migrations. <b>The value is turning a runbook into a file.</b> A deploy that lives in someone's shell history is a deploy that goes wrong the week they are on holiday.\n\n<b>Pennant</b> is feature flags:\n\n```text\nnew dashboard → Pennant → enabled?\n                          yes → new UI\n                          no  → old UI\n```\n\n---\n\n### 3. Advanced — why flags change how you ship\n\nWithout flags:\n\n```text\ndeploy → 100% of users, immediately\n```\n\nWith them:\n\n```text\ndeploy → internal users → test → 10% → monitor → 100%\n```\n\n<b>The real move is separating deployment from release.</b> Code ships dark, and turning it on is a config change rather than a deploy. Which means <b>your rollback is a toggle, not a redeploy</b>, and that difference is minutes versus seconds while something is actively broken.\n\nIt also lets you merge continuously instead of holding a long-lived branch for a month, which is where the worst merge conflicts of your life come from.\n\n<b>The cost is real:</b> every flag is a branch in your code and, in principle, a doubling of what you must test. Flags that are never removed become permanent complexity, and a codebase with forty stale flags has paths nobody has executed in a year. <b>Delete a flag once it is at 100%</b>, and treat that as part of shipping the feature, not a tidy-up for later.\n\n---\n\n### The map\n\n```text\n                  Laravel\n       ┌─────────────┼─────────────┐\n   Development    Operations    Production\n   Artisan        Envoy         Nightwatch\n   Pint           Scheduler     Pulse\n   Telescope      Queues\n   Boost\n```\n\nAnd the structural one, which is the actual lesson of the whole day:\n\n```text\n              Laravel application\n   ┌────────────────┼────────────────┐\nHTTP/API         Artisan         Scheduler\nControllers      Commands           Jobs\n   └────────────────┼────────────────┘\n              Application logic\n         ┌───────────┼───────────┐\n     Database      Queue       Events\n```\n\n<b>Three doors into one room.</b> Controllers, commands and scheduled jobs are all thin entry points to the same logic, and the senior skill is knowing which door a piece of functionality needs and then using this tooling to make it <b>testable, observable, maintainable and safe to operate</b>.",
      diagram: `Boost and MCP

    old       developer → read docs → search code
                        → write code

    agentic   developer → agent → Laravel-aware tools
                        → inspect → modify → test

  The shift: the agent can look at your ACTUAL
  application — your routes, your schema, your
  version — instead of guessing from training data.

  The skill is not "let AI write everything". It is
  giving the agent enough context and enough
  CONSTRAINTS that its changes are safe.

    engineer still owns:
      architecture · security · correctness
      testing · trade-offs

  Generated code needs the same review and the same
  tests. Day 29 is what makes that tractable: a suite
  that goes red beats a careful read of a diff you did
  not write.


Envoy

    local machine → Envoy → SSH → server → commands

    deploy · restart workers · clear caches · migrate

  The value is turning a RUNBOOK INTO A FILE.

  A deploy that lives in someone's shell history is a
  deploy that goes wrong the week they are on holiday.


Pennant — feature flags

    new dashboard → Pennant → enabled?
                                yes → new UI
                                no  → old UI

  Without flags:

    deploy → 100% of users, immediately

  With them:

    deploy → internal users → test → 10%
           → monitor → 100%

  The real move: DEPLOYMENT separated from RELEASE.

    code ships dark
    turning it on is a config change, not a deploy
    rollback is a TOGGLE, not a redeploy
      → seconds instead of minutes, while something
        is actively broken

  Also lets you merge continuously instead of holding
  a branch for a month — the source of the worst merge
  conflicts of your life.

  ⚠️  The cost is real.

      Every flag is a branch in your code and, in
      principle, a doubling of what you must test.

      Forty stale flags = paths nobody has executed
      in a year.

      Delete a flag at 100%. That is part of shipping
      the feature, not a tidy-up for later.


The tooling map

                    Laravel
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   Development     Operations      Production
       │               │               │
    Artisan         Envoy          Nightwatch
    Pint            Scheduler      Pulse
    Telescope       Queues
    Boost


The structural map — the day's real lesson

                Laravel application
                        │
     ┌──────────────────┼──────────────────┐
     ▼                  ▼                  ▼
  HTTP/API           Artisan           Scheduler
     │                  │                  │
  Controllers        Commands             Jobs
     │                  │                  │
     └──────────────────┼──────────────────┘
                        ▼
                Application logic
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
        Database      Queue       Events

  Three doors into one room.

  The senior skill is knowing which door a piece of
  functionality needs — and then using this tooling
  to make it testable, observable, maintainable and
  safe to operate.`,
      codeExample: {
        title: "Envoy tasks, Pennant flags and the three doors",
        code: `# ---------- Envoy.blade.php: the runbook as a file ----------

@servers(['web' => 'deploy@invoicehub.com'])

@setup
    $repo = 'git@github.com:acme/invoicehub.git';
    $path = '/var/www/invoicehub';
@endsetup

@task('deploy', ['on' => 'web'])
    cd {{ $path }}
    php artisan down --render="errors::503"

    git pull origin main
    composer install --no-dev --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    php artisan queue:restart
    php artisan up
@endtask

@task('workers:restart', ['on' => 'web'])
    cd {{ $path }} && php artisan queue:restart
@endtask

# envoy run deploy
#
# A deploy in someone's shell history goes wrong the
# week they are on holiday.


<?php
// ---------- Pennant ----------

// app/Providers/AppServiceProvider.php
use Laravel\\Pennant\\Feature;

Feature::define('new-invoice-editor', fn (User $user) => match (true) {
    $user->isInternal()      => true,
    $user->team->is_beta     => true,
    default                  => Lottery::odds(1, 10),   // 10%
});

// In a controller
if (Feature::active('new-invoice-editor')) {
    return view('invoices.editor-v2');
}

return view('invoices.editor');

// In Blade
// @feature('new-invoice-editor')
//     <x-invoice-editor-v2 />
// @else
//     <x-invoice-editor />
// @endfeature


<?php
// ---------- Deployment separated from release ----------

// 1. Merge and deploy with the flag off — code ships dark
// 2. Feature::activateForEveryone / for a segment
// 3. Watch Pulse
// 4. Broaden
//
// And when it breaks:
Feature::deactivateForEveryone('new-invoice-editor');
// A toggle. Seconds, not a redeploy.


<?php
// ---------- Removing a flag is part of shipping ----------

// At 100% for a week with no issues:
//   1. delete the old branch of the code
//   2. delete the Feature::define
//   3. php artisan pennant:purge new-invoice-editor
//
// Forty stale flags means forty code paths nobody has
// executed in a year.


<?php
// ---------- The three doors, one room ----------

// The room
final class InvoiceIssuer
{
    public function issue(Invoice $invoice): void { /* ... */ }
}

// Door 1: HTTP
class InvoiceIssueController
{
    public function store(Invoice $invoice, InvoiceIssuer $issuer)
    {
        $this->authorize('update', $invoice);
        $issuer->issue($invoice);

        return response()->noContent();
    }
}

// Door 2: Artisan
class IssueInvoices extends Command
{
    protected $signature = 'invoices:issue {invoice}';

    public function handle(InvoiceIssuer $issuer): int
    {
        $issuer->issue(Invoice::findOrFail($this->argument('invoice')));

        return self::SUCCESS;
    }
}

// Door 3: Scheduler → queue
Schedule::command('invoices:issue-due')->dailyAt('06:00')->onOneServer();

// Same logic. Tested once. Observable in Telescope,
// summarised in Pulse, deployed by Envoy, rolled out
// by Pennant.`,
      },
      keyTakeaways: [
        "<b>Boost gives coding agents Laravel-aware context</b>, and MCP is the protocol they use to reach tools.",
        "<b>The agent can inspect your real routes, schema and version</b> rather than guessing from training data.",
        "<b>The skill is supplying context and constraints</b>, not delegating judgement.",
        "<b>Generated code needs the same review and tests</b>, and a red suite beats reading a diff you did not write.",
        "<b>Envoy turns a deploy runbook into a file</b>, so it does not live in one person's shell history.",
        "<b>Pennant flags separate deployment from release</b>: code ships dark and is switched on by config.",
        "<b>Rollback becomes a toggle rather than a redeploy</b>, which is seconds instead of minutes.",
        "<b>Flags also let you merge continuously</b> instead of holding a branch that becomes a merge nightmare.",
        "<b>Every flag is a branch and a testing cost</b>, so deleting one at 100% is part of shipping the feature.",
        "<b>Controllers, commands and scheduled jobs are three doors into the same room.</b>",
        "<b>The senior skill is choosing the door</b>, then using this tooling to make it testable, observable and safe to operate.",
      ],
      commonMistakes: [
        "<b>Shipping agent-written code without tests or review.</b> The engineer still owns correctness.",
        "<b>Keeping deploys in a shell history.</b> Unrepeatable, unreviewable and person-dependent.",
        "<b>Never removing flags.</b> Forty stale ones means code paths nobody has run in a year.",
        "<b>Treating a flag as free.</b> Each one doubles the paths you should be testing.",
        "<b>Writing the same logic in a controller, a command and a job.</b> Three copies that drift apart.",
      ],
      quiz: [
        {
          question: "What is the real shift Boost and MCP enable?",
          options: [
            "AI writes the whole application",
            "The agent can inspect your actual routes, schema and version instead of guessing from training data",
            "Faster autocomplete",
            "Automatic deployment",
          ],
          correctIndex: 1,
          explanation: "The engineer still owns architecture, security, correctness and testing.",
        },
        {
          question: "What is the main value of Envoy?",
          options: [
            "Faster SSH",
            "It turns a deploy runbook into a reviewable file rather than one person's shell history",
            "It replaces the scheduler",
            "It monitors servers",
          ],
          correctIndex: 1,
          explanation: "Reproducible operations do not depend on who is on holiday.",
        },
        {
          question: "What does a feature flag fundamentally separate?",
          options: [
            "Frontend from backend",
            "Deployment from release, so rollback is a toggle rather than a redeploy",
            "Testing from production",
            "Queues from jobs",
          ],
          correctIndex: 1,
          explanation: "Code ships dark and is switched on by config.",
        },
        {
          question: "Why must flags be removed once fully rolled out?",
          options: [
            "Pennant limits them",
            "Each is a branch and a testing cost, and stale flags become paths nobody has executed in a year",
            "They slow the app",
            "They expire automatically",
          ],
          correctIndex: 1,
          explanation: "Deleting the flag is part of shipping the feature.",
        },
        {
          question: "What is the structural lesson of the day?",
          options: [
            "Use every tool",
            "Controllers, commands and scheduled jobs are three thin doors into the same application logic",
            "Artisan replaces controllers",
            "Feature flags replace testing",
          ],
          correctIndex: 1,
          explanation: "Pick the door, then make the room testable, observable and safe to operate.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the most useful way to think about Artisan?",
      options: [
        "A code generator",
        "Your application's operational interface, the way HTTP is its user interface",
        "A migration runner",
        "A local development server",
      ],
      correctIndex: 1,
      explanation: "Backfills, retries and exports belong there rather than in a hand-run query.",
    },
    {
      question: "Where should a command's business logic live?",
      options: [
        "In `handle()`",
        "In a service that the controller, command and job all call",
        "In the model",
        "In a closure command",
      ],
      correctIndex: 1,
      explanation: "The command is an entry point, so the logic exists once.",
    },
    {
      question: "What is wrong with calling `Artisan::call` from a controller?",
      options: [
        "Nothing",
        "No usable return value, exceptions arrive as exit codes, and it needs the console kernel to test",
        "It is slower",
        "It bypasses middleware",
      ],
      correctIndex: 1,
      explanation: "That makes a shell command into your service layer.",
    },
    {
      question: "What is the difference between `{email}` and `{--email=}`?",
      options: [
        "Nothing",
        "A positional argument versus a named option that takes a value",
        "The first is optional",
        "The second is required",
      ],
      correctIndex: 1,
      explanation: "Arguments are positional; options are named.",
    },
    {
      question: "Why is `{client?}` risky on a destructive command?",
      options: [
        "Optional arguments are unsupported",
        "Forgetting the argument runs the destructive action against everything",
        "It cannot be validated",
        "It breaks help output",
      ],
      correctIndex: 1,
      explanation: "The broad form should be an explicit `--all` you have to type.",
    },
    {
      question: "What happens when `handle()` returns nothing?",
      options: [
        "It throws",
        "It exits 0, so a failed run looks successful to the scheduler and monitoring",
        "It exits 1",
        "Laravel warns you",
      ],
      correctIndex: 1,
      explanation: "Return `self::FAILURE` so alerting can fire.",
    },
    {
      question: "Why is `select()` safer than free-text input?",
      options: [
        "It is faster",
        "An invalid value is not expressible, so input that never had to be free-form cannot be wrong",
        "It validates automatically",
        "It works without a terminal",
      ],
      correctIndex: 1,
      explanation: "Free text accepts `prod`, `Production` and typos alike.",
    },
    {
      question: "What happens when the scheduler runs a command that prompts?",
      options: [
        "It uses the defaults",
        "There is no TTY, so it hangs or throws, every night, with nobody watching",
        "It skips the prompts",
        "It fails with a clear message",
      ],
      correctIndex: 1,
      explanation: "Options must be able to supply everything the prompts ask for.",
    },
    {
      question: "What pattern makes one command work for both humans and scripts?",
      options: [
        "Two separate commands",
        "Options are the real interface, and prompts fill in what was not passed",
        "Always prompt",
        "Never prompt",
      ],
      correctIndex: 1,
      explanation: "`$this->option('name') ?? text(...)`, plus `--force` to skip confirmations.",
    },
    {
      question: "Why must a destructive `confirm()` default to no?",
      options: [
        "Convention",
        "Enter-without-reading is what a tired operator does, so the safe answer must be the default",
        "Laravel requires it",
        "It is faster",
      ],
      correctIndex: 1,
      explanation: "The default should be the outcome you can recover from.",
    },
    {
      question: "Spinner or progress bar?",
      options: [
        "Always a spinner",
        "Spinner when the duration is unknown, progress bar when you know the total",
        "Always a progress bar",
        "Neither for short commands",
      ],
      correctIndex: 1,
      explanation: "Without either, the operator assumes it froze and hits Ctrl-C.",
    },
    {
      question: "What is wrong with `progress(steps: User::all())`?",
      options: [
        "Nothing",
        "It loads the whole table into memory, so the bar costs RAM proportional to the data",
        "The bar is inaccurate",
        "It cannot show a label",
      ],
      correctIndex: 1,
      explanation: "Chunk and advance the bar manually.",
    },
    {
      question: "Why is `Done.` a poor final message?",
      options: [
        "Too short",
        "It gives the operator no counts, no skips and no reasons, so nothing to act on",
        "It is not coloured",
        "It should be a table",
      ],
      correctIndex: 1,
      explanation: "A silent skip is a bug that hides for months.",
    },
    {
      question: "Why does it matter that `error()` writes to stderr?",
      options: [
        "It is faster",
        "Cron and CI can route real failures separately from routine output",
        "It shows in red",
        "It halts the command",
      ],
      correctIndex: 1,
      explanation: "Stream choice is what alerting hooks into.",
    },
    {
      question: "Where does an isolation lock live?",
      options: [
        "In the database",
        "In the cache, so a file or array driver gives each server its own lock and no protection",
        "In a shared lock file",
        "In the session",
      ],
      correctIndex: 1,
      explanation: "Cross-server isolation needs a shared cache such as Redis.",
    },
    {
      question: "What is the difference between `withoutOverlapping()` and `onOneServer()`?",
      options: [
        "They are identical",
        "The first stops runs overlapping in time on one server; the second stops several servers running the same schedule",
        "The first is for queues",
        "The second is deprecated",
      ],
      correctIndex: 1,
      explanation: "Different problems, and you usually want both.",
    },
    {
      question: "What is the trap in `withoutOverlapping()`'s default?",
      options: [
        "It never expires",
        "The lock lasts 24 hours, so a killed run silently blocks the task for a day",
        "It expires in one minute",
        "It requires Redis",
      ],
      correctIndex: 1,
      explanation: "Pass an expiry in minutes matching the task's realistic maximum.",
    },
    {
      question: "What is the practical cost of inconsistent code style?",
      options: [
        "It looks bad",
        "Diff noise: a PR that is mostly whitespace does not get reviewed properly",
        "Slower execution",
        "Merge conflicts only",
      ],
      correctIndex: 1,
      explanation: "Reviewer attention is finite and style spends it first.",
    },
    {
      question: "How should Pint be introduced to an existing codebase?",
      options: [
        "One full run over everything",
        "With `--dirty`, so only changed files must be clean and the codebase converges",
        "Only in the editor",
        "With a custom preset",
      ],
      correctIndex: 1,
      explanation: "A full run conflicts with every open branch and destroys `git blame`.",
    },
    {
      question: "What does Pint not do?",
      options: [
        "Fix spacing",
        "Find bugs, such as a method returning null that the caller never checks",
        "Order imports",
        "Run in CI",
      ],
      correctIndex: 1,
      explanation: "That is static analysis: PHPStan or Larastan.",
    },
    {
      question: "What makes Telescope dangerous in production?",
      options: [
        "It is slow to load",
        "It records everything including request payloads, so growth is unbounded and secrets land in a browsable UI",
        "It requires Redis",
        "It disables queues",
      ],
      correctIndex: 1,
      explanation: "Gate it, filter it, hide parameters and prune on a schedule.",
    },
    {
      question: "What is the difference between Telescope and Pulse?",
      options: [
        "Pulse is newer",
        "Telescope shows one request in full detail; Pulse aggregates all requests into health metrics",
        "Pulse is local only",
        "They are the same",
      ],
      correctIndex: 1,
      explanation: "Aggregation is what makes Pulse production-safe.",
    },
    {
      question: "Why is a dashboard not alerting?",
      options: [
        "It is too slow",
        "It only tells you something when you look at it, and nobody is looking at 3am",
        "It does not record errors",
        "It works only locally",
      ],
      correctIndex: 1,
      explanation: "Alerting says something is wrong; observability says what.",
    },
    {
      question: "What do feature flags fundamentally separate?",
      options: [
        "Frontend from backend",
        "Deployment from release, so rollback is a toggle rather than a redeploy",
        "Testing from production",
        "Queues from jobs",
      ],
      correctIndex: 1,
      explanation: "Code ships dark and is switched on by config.",
    },
    {
      question: "Why must a flag be removed once it is at 100%?",
      options: [
        "Pennant limits them",
        "Each flag is a branch and a testing cost, and stale ones become paths nobody has run in a year",
        "They slow the app",
        "They expire on their own",
      ],
      correctIndex: 1,
      explanation: "Removing the flag is part of shipping the feature.",
    },
    {
      question: "What is the structural lesson tying the day together?",
      options: [
        "Install every tool",
        "Controllers, commands and scheduled jobs are three thin doors into the same application logic",
        "Artisan replaces controllers",
        "Feature flags replace tests",
      ],
      correctIndex: 1,
      explanation: "Pick the door, then make the room testable, observable and safe to operate.",
    },
  ],
  project: {
    name: "InvoiceHub — a command safe enough to schedule",
    goal: "Build `invoices:process` with Prompts, a progress bar and isolation, then prove it by running it four ways: interactively, from a script, twice at once, and from the scheduler.",
    brief:
      "The self-check asks for an Artisan command that uses Prompts and shows a progress bar. That is the easy half. The hard half is that <b>the same command has to survive being run by cron</b>, where there is no terminal, nobody is watching and a second copy may already be running.\n\nMost interactive commands fail the moment they are scheduled. They hang on a prompt that cannot appear, or two servers run them at once, or they fail and return exit 0 so nothing alerts. <b>Your command has to work all four ways with no code changes</b>, which is what makes it an operational tool rather than a demo.\n\nThe target experience:\n\n```text\n$ php artisan invoices:process\n\nWhat should we do?\n❯ Send reminders for overdue invoices\n  Recalculate totals\n  Mark overdue\n\nProcess 50 invoices?\n❯ Yes\n\nProcessing invoices...\n████████████████████████████████ 100%\n\nProcessed 50 invoices. 47 reminded, 3 skipped (no client email).\n```\n\nAnd the same command in a crontab:\n\n```bash\nphp artisan invoices:process --action=remind --force -n --isolated\n```\n\nSame code. No prompts, no hang, a real exit code.",
    steps: [
      "Create the command with `make:command ProcessInvoices` and give it a signature where <b>every prompt has an option equivalent</b>: `{--action=}`, `{--limit=}`, `{--force}`. Write a description for each, then run `php artisan help invoices:process` and read it as if you were on call.",
      "Extract the actual work into a service class first, before writing any of the command body. `handle()` should read as: gather input, call the service, report the result. If you cannot describe `handle()` in three lines, the logic is in the wrong place.",
      "Add the prompts, each guarded by its option: `$this->option('action') ?? select(...)`. Use `select()` for the action so an invalid value cannot be typed, and add `validate:` to anything free-form.",
      "Add the confirmation with `default: false` and skip it entirely when `--force` is passed. Print the count in the question, so the operator sees `Process 50 invoices?` rather than `Are you sure?`.",
      "Add the progress bar over `chunkById`, not `all()`. Track counts as you go: processed, succeeded, skipped, and the reason for each skip.",
      "Write a real summary: the totals, and a `$this->table()` of the first ten skipped records with the reason. Put per-record output behind `$this->output->isVerbose()`.",
      "Return `self::SUCCESS` only when nothing failed, `self::FAILURE` when something did, and `self::INVALID` when the input was wrong. Then run `php artisan invoices:process --action=nonsense; echo $?` and confirm you get a non-zero code.",
      "Implement `Isolatable` and set `isolationLockExpiresAt()` to something matching the realistic maximum runtime, not 24 hours. Confirm your cache driver is shared, because a file driver gives you no protection at all.",
      "Schedule it with `->withoutOverlapping(30)`, `->onOneServer()` and `->pingOnFailure(...)` or `->emailOutputOnFailure(...)`. Then run `php artisan schedule:list` and check that what you see matches what you meant.",
      "Write tests. One asserting the output and exit code on the happy path, one asserting `expectsConfirmation('...', 'no')` cancels and changes nothing, one asserting a bad `--action` returns a non-zero exit, and one asserting `--force` skips the confirmation entirely.",
      "NOW RUN IT FOUR WAYS. (1) Interactively, and answer the prompts. (2) Fully non-interactive with `-n` and every option supplied, and confirm it does not hang. (3) In two terminals at once with `--isolated`, and confirm the second is blocked. (4) Via `php artisan schedule:test`, and confirm it completes with no terminal.",
      "Run `./vendor/bin/pint --dirty` and add it plus your tests to a `composer check` script. Then open Telescope, run the command, and find your command's entry alongside the queries it ran.",
    ],
    acceptance: [
      "`php artisan help invoices:process` explains every argument and option without reading the source.",
      "`handle()` is under fifteen lines and contains no business logic.",
      "Every prompt has an option equivalent, so the command runs fully non-interactively with `-n`.",
      "The confirmation defaults to no, states the count, and is skipped by `--force`.",
      "The progress bar runs over chunked results, and memory does not scale with the table size.",
      "The final line reports totals and skip reasons, and per-record detail appears only under `-v`.",
      "A failed run returns a non-zero exit code, verified with `echo $?`.",
      "Running two copies concurrently with `--isolated` blocks the second one.",
      "`schedule:list` shows the task with overlap protection, one-server protection and a failure hook.",
      "Four tests pass: happy path, declined confirmation, invalid input, and `--force`.",
      "`./vendor/bin/pint --test --dirty` is clean and the tests pass via one `composer check`.",
    ],
    stretch: [
      "Add a `--dry-run` flag that does everything except write, and print what would have changed. Then notice that this is the flag you will actually reach for first, every time you run it in production.",
      "Put the whole feature behind a Pennant flag, roll it out to internal users only, and then write down how you would turn it off at 3am. If the answer involves a deploy, the flag is not doing its job.",
      "Break the isolation deliberately: set `CACHE_STORE=file`, run two copies with `--isolated`, and watch both run. That silent failure is the one worth having seen once.",
      "Write an Envoy task that runs this command on a server, and compare it with the shell command you would otherwise type. Note which one you could hand to somebody else.",
      "Add a Pulse recorder or a custom Telescope tag for the command, then run it and find it in the dashboard. Ask yourself what you would have wanted recorded if this had failed at 2am.",
    ],
  },
};
