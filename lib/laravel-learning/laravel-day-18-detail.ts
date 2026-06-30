import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_18_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Artisan is Laravel's built-in command-line tool — think of it like a remote control for your application. Every `php artisan` command you've used so far was built-in. Today you build your own.\n\nCustom commands are perfect for:\n• Database seeders and one-off data migrations\n• Scheduled background tasks (sending digest emails, cleaning old records)\n• Dev utilities (generating fake test data, syncing API data)\n• Admin operations you don't want to expose in a UI",
      np: "Artisan = Laravel को command-line tool। Custom commands build गर्न सिक्ने।",
      jp: "Artisan は Laravel の CLI ツール。カスタムコマンドの作り方を学びます。",
    },
    {
      en: "Today's topics:\n• <b>`make:command` scaffold</b> — generate a command class with one line\n• <b>Command signature</b> — define the name, arguments, options, and flags\n• <b>`handle()` method</b> — where your command logic lives\n• <b>I/O helpers</b> — `info`, `error`, `warn`, `table`, `ask`, `confirm`, `progressBar`\n• <b>Calling commands from code</b> — `Artisan::call()` and `Artisan::queue()`\n• <b>Scheduling</b> — define recurring tasks in PHP instead of raw cron",
      np: "make:command, signature, handle(), I/O helpers, Artisan::call(), scheduling।",
      jp: "make:command、シグネチャ、handle()、I/O、Artisan::call()、スケジュールを学びます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Creating your first command",
        np: "पहिलो command बनाउने",
        jp: "最初のコマンドを作る",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every Artisan command is a PHP class that extends `Command`. Running `php artisan make:command` generates the boilerplate. The `$signature` property defines the command name and its inputs — think of it like a function signature but for the terminal. The `$description` is shown in `php artisan list`.",
            np: "`Command` extend गर्ने PHP class। `$signature` = command को नाम र inputs।",
            jp: "`Command` を継承した PHP クラス。`$signature` でコマンド名と入力を定義。",
          },
        },
        {
          type: "code",
          title: { en: "Generate and run a custom command", np: "Custom command बनाउने", jp: "カスタムコマンドを生成する" },
          code: `# Generate the command class
php artisan make:command SendWeeklyDigest

# app/Console/Commands/SendWeeklyDigest.php
namespace App\\Console\\Commands;

use Illuminate\\Console\\Command;

class SendWeeklyDigest extends Command
{
    protected $signature = 'emails:digest {--dry-run : Preview without sending}';
    protected $description = 'Send the weekly digest email to all subscribers';

    public function handle(): int
    {
        if ($this->option('dry-run')) {
            $this->info('DRY RUN — no emails will be sent.');
        } else {
            $this->info('Sending digest...');
            // dispatch(new SendDigestJob());
        }

        return self::SUCCESS; // returns exit code 0
    }
}

# Run it
php artisan emails:digest
php artisan emails:digest --dry-run`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Command naming convention:</b> use `noun:verb` format (e.g. `emails:digest`, `users:cleanup`, `reports:generate`). This groups related commands together in `php artisan list`. The namespace (before the colon) is just a label — it does not map to a PHP namespace.",
            np: "`noun:verb` format use गर्ने — e.g. `emails:digest`, `users:cleanup`।",
            jp: "`noun:verb` 形式を使う。コロンの前は PHP 名前空間とは無関係のラベル。",
          },
        },
      ],
    },
    {
      title: {
        en: "Arguments, options & flags",
        np: "Arguments, options र flags",
        jp: "引数・オプション・フラグ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The command signature syntax borrows from Unix conventions. Think of it like ordering at a coffee shop:\n• The <b>drink name</b> is an argument (required, positional)\n• <b>Milk type</b> is an option (has a value, starts with `--`)\n• <b>\"To go\"</b> is a flag (boolean — present means true, absent means false)\n\nArguments are required by default. Options and flags are always optional.",
            np: "Argument = required positional। Option = `--name=value`। Flag = `--force` (boolean)।",
            jp: "引数は位置指定で必須。オプションは `--name=value`。フラグは `--force` のような真偽値。",
          },
        },
        {
          type: "code",
          title: { en: "Rich signature with arguments, options & flags", np: "Complex signature", jp: "引数・オプション・フラグのサンプル" },
          code: `// Signature with argument, options, and a flag
protected $signature = 'users:export
    {environment : The environment to export from (e.g. production)}
    {--format=csv : Output format — csv or json}
    {--limit=100 : Maximum number of records to export}
    {--force : Skip the confirmation prompt}';

public function handle(): int
{
    $env    = $this->argument('environment');    // e.g. "production"
    $format = $this->option('format');           // "csv" or "json"
    $limit  = (int) $this->option('limit');      // 100 by default
    $force  = $this->option('force');            // true if --force passed

    if (!in_array($format, ['csv', 'json'])) {
        $this->error("Invalid format: {$format}. Use csv or json.");
        return self::FAILURE;
    }

    if (!$force && !$this->confirm("Export {$limit} users from {$env}?")) {
        $this->line('Cancelled.');
        return self::SUCCESS;
    }

    $this->info("Exporting {$limit} users as {$format}...");
    return self::SUCCESS;
}

// Optional argument with a default value
// {environment=production}  ← uses "production" if not provided`,
        },
        {
          type: "paragraph",
          text: {
            en: "Artisan does NOT validate argument types automatically — everything arrives as a string. Validate inside `handle()` with `if (!in_array(...))` or `if (!is_numeric(...))`. This is intentional — you decide what constitutes a valid value for your specific command.",
            np: "Artisan ले type validate गर्दैन — handle() भित्र आफैं validate गर्नुपर्छ।",
            jp: "Artisan は型バリデーションをしない。`handle()` の中で自分でバリデーションする。",
          },
        },
      ],
    },
    {
      title: {
        en: "Console output — tables, progress bars & prompts",
        np: "Console output — table, progress bar र prompt",
        jp: "コンソール出力 — テーブル・プログレスバー・プロンプト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Good CLI tools give clear, coloured feedback:\n• `$this->info('...')` — green (success messages)\n• `$this->error('...')` — red (errors)\n• `$this->warn('...')` — yellow (warnings)\n• `$this->line('...')` — plain white (neutral output)\n\nFor structured data use `$this->table()`. For long loops use a progress bar. For interactive scripts use `ask()` and `confirm()`.",
            np: "info() = green, error() = red, warn() = yellow। Table, progress bar, ask/confirm।",
            jp: "info() 緑・error() 赤・warn() 黄色。テーブル、プログレスバー、ask/confirm も使える。",
          },
        },
        {
          type: "code",
          title: { en: "Tables, progress bars & prompts", np: "Table, progress bar, prompt", jp: "テーブル・プログレスバー・プロンプト" },
          code: `// Table output
$users = User::select('name', 'email', 'role')->get();
$this->table(
    ['Name', 'Email', 'Role'],
    $users->map(fn($u) => [$u->name, $u->email, $u->role])
);

// Progress bar (manual)
$items = Post::all();
$bar = $this->output->createProgressBar(count($items));
$bar->start();
foreach ($items as $item) {
    // process $item...
    $bar->advance();
}
$bar->finish();
$this->newLine(); // move cursor to next line after bar

// Progress bar (shorthand — handles start/advance/finish for you)
$this->withProgressBar($items, function (Post $post) {
    // process $post...
});

// Interactive prompts
$name  = $this->ask('What is the user\\'s name?');
$email = $this->ask('Email address', 'default@example.com');
$role  = $this->choice('Select role', ['admin', 'editor', 'viewer'], 'viewer');

if ($this->confirm('Are you sure you want to delete all records?')) {
    // proceed
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Use `$this->newLine()` to add blank lines for visual breathing room. Use `$this->newLine(2)` for two blank lines. For very long output, consider piping to `less` (`php artisan cmd | less`) rather than flooding the terminal.",
            np: "`newLine()` = blank line। Long output लाई `| less` मा pipe गर्न सकिन्छ।",
            jp: "`newLine()` で空行を挿入。長い出力は `| less` にパイプするのがおすすめ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Calling commands from code & chaining",
        np: "Code बाट command call गर्ने",
        jp: "コードからコマンドを呼ぶ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You can call Artisan commands from controllers, jobs, or other commands. This is useful for:\n• Running a command from a web UI trigger (e.g. an admin \"Run now\" button)\n• Chaining commands in a workflow (clear cache → rebuild index)\n• Testing commands programmatically\n\nUse `Artisan::call()` for synchronous execution, or `Artisan::queue()` to dispatch to the queue.",
            np: "Artisan::call() = synchronous। Artisan::queue() = queue मा dispatch।",
            jp: "Artisan::call() で同期実行。Artisan::queue() でキューに投入。",
          },
        },
        {
          type: "code",
          title: { en: "Artisan::call(), output capture & chaining", np: "Command call गर्ने", jp: "コマンドを呼び出す" },
          code: `use Illuminate\\Support\\Facades\\Artisan;

// Call from a controller
Artisan::call('emails:digest', ['--dry-run' => true]);

// Capture the command's output
Artisan::call('reports:generate', ['--format' => 'csv']);
$output = Artisan::output(); // returns the printed text as a string

// Call from inside another command
public function handle(): int
{
    $this->call('cache:clear');           // runs synchronously, inherits I/O
    $this->callSilently('config:cache');  // runs silently (no output)
    return self::SUCCESS;
}

// Dispatch to the queue (non-blocking)
Artisan::queue('reports:generate', ['--format' => 'csv'])
    ->onQueue('reports')
    ->onConnection('redis');`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Testing commands in Pest:</b> use the `artisan()` helper to make assertions on the command's output, exit code, and interactions.\n\n↳ `$this->artisan('emails:digest')->assertExitCode(0)->expectsOutput('Sending digest...')`\n↳ `$this->artisan('users:export', ['environment' => 'staging'])->expectsQuestion(...)->assertExitCode(0)`\n\nDependencies injected via the service container can be mocked with `$this->mock(MyService::class, ...)` before calling `artisan()`.",
            np: "Test मा artisan() helper use गर्ने। assertExitCode(0), expectsOutput() use गर्ने।",
            jp: "テストでは artisan() ヘルパーを使い assertExitCode() や expectsOutput() で検証する。",
          },
        },
      ],
    },
    {
      title: {
        en: "Scheduling commands with the console kernel",
        np: "Commands schedule गर्ने",
        jp: "コマンドをスケジュールする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Instead of setting up a separate cron job for every task, Laravel uses a single cron entry that fires every minute. You define all your recurring tasks in PHP code — Laravel figures out which ones to run right now. Think of it like a weekly planner: you write all your tasks in one place and your assistant ticks off what's due.",
            np: "एउटा cron entry मात्र। बाँकी schedule PHP code मा define गर्ने।",
            jp: "cron エントリは 1 つだけ。スケジュールは PHP コードで定義する。",
          },
        },
        {
          type: "code",
          title: { en: "Server cron entry + routes/console.php schedule", np: "Cron entry र schedule", jp: "cron エントリとスケジュール定義" },
          code: `# Add ONE cron entry to the server (runs every minute)
* * * * * cd /var/www/myapp && php artisan schedule:run >> /dev/null 2>&1

# routes/console.php (Laravel 11 style — no Kernel class needed)
use Illuminate\\Support\\Facades\\Schedule;

// Send weekly digest every Monday at 8:00 AM
Schedule::command('emails:digest')
    ->weeklyOn(1, '8:00')
    ->withoutOverlapping()  // skip if previous run is still going
    ->runInBackground();    // don't block other scheduled jobs

// Clean up expired sessions every day at midnight
Schedule::command('sessions:cleanup')
    ->daily()
    ->at('00:00')
    ->timezone('Asia/Tokyo');

// Cache reports every hour
Schedule::command('reports:cache')
    ->hourly()
    ->withoutOverlapping();

// Other frequency helpers
// ->everyFiveMinutes()
// ->everyThirtyMinutes()
// ->monthly()
// ->monthlyOn(15, '09:00')  // 15th of each month at 9am

# Test scheduling locally (runs due tasks and waits)
php artisan schedule:work`,
        },
        {
          type: "paragraph",
          text: {
            en: "`withoutOverlapping()` prevents a second run from starting if the previous one is still running — crucial for slow tasks like report generation. Combine it with `runInBackground()` so slow tasks don't block shorter jobs that are scheduled at the same time.\n\n↳ Without `runInBackground()`, scheduled tasks execute sequentially — if task A takes 5 minutes, task B misses its window\n↳ With `runInBackground()`, both spawn as separate OS processes and run in parallel",
            np: "withoutOverlapping() = duplicate run रोक्छ। runInBackground() = parallel run।",
            jp: "withoutOverlapping() で二重実行を防ぎ、runInBackground() で並列実行する。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Where should I register my custom commands in Laravel 11?",
        np: "Laravel 11 मा custom commands कहाँ register गर्ने?",
        jp: "Laravel 11 でカスタムコマンドはどこに登録する？",
      },
      answer: {
        en: "In Laravel 11, commands in `app/Console/Commands/` are auto-discovered — no registration needed. If you place commands elsewhere, add the directory path via `withConsoleCommands()` in `bootstrap/app.php`:\n\n`->withConsoleCommands(base_path('app/Admin/Commands'))`\n\nThe old `app/Console/Kernel.php` with a `$commands` array was removed in Laravel 11.",
        np: "`app/Console/Commands/` मा auto-discover हुन्छ। अन्यत्र राखे bootstrap/app.php मा register गर्नुपर्छ।",
        jp: "`app/Console/Commands/` は自動検出される。別の場所は `bootstrap/app.php` で登録する。",
      },
    },
    {
      question: {
        en: "How do I pass an array of values as an option?",
        np: "Option मा array values कसरी pass गर्ने?",
        jp: "オプションに配列を渡すには？",
      },
      answer: {
        en: "Define the option as variadic using `*`:\n\n`{--user=* : User IDs to process}`\n\nAccess with `$this->option('user')` — it returns an array. Call it like:\n\n`php artisan users:notify --user=1 --user=2 --user=5`\n\nIf no `--user` is passed, `$this->option('user')` returns an empty array `[]`.",
        np: "`{--user=*}` syntax use गर्ने। `$this->option('user')` ले array return गर्छ।",
        jp: "`{--user=*}` で可変引数オプションを定義。`$this->option('user')` が配列を返す。",
      },
    },
    {
      question: {
        en: "Can I use Auth inside a console command?",
        np: "Console command भित्र Auth use गर्न सकिन्छ?",
        jp: "コンソールコマンドの中で Auth を使える？",
      },
      answer: {
        en: "Don't use `Auth::login()` in console commands — the session that login creates only lasts the duration of the HTTP request lifecycle. Instead, pass a user ID as an argument and load the user manually:\n\n`$user = User::findOrFail($this->argument('userId'));`\n\nThen pass `$user` directly to any service that needs it. In tests, use `$this->actingAs($user)` before `artisan()`.",
        np: "Console मा `Auth::login()` नगर्ने। User ID argument मा pass गरेर manually load गर्ने।",
        jp: "コンソールで `Auth::login()` は使わない。引数でユーザー ID を受け取り手動で取得する。",
      },
    },
    {
      question: {
        en: "Can I run scheduled tasks in parallel?",
        np: "Scheduled tasks parallel मा run गर्न सकिन्छ?",
        jp: "スケジュールタスクを並列実行できる？",
      },
      answer: {
        en: "Yes — use `->runInBackground()` on each command. This spawns each task as a separate OS process so they run simultaneously instead of one after another.\n\nWithout `runInBackground()`: tasks run sequentially. A slow task at 2:00 AM delays every other task scheduled for the same minute.\n\nWith `runInBackground()`: each task spawns independently. The scheduler finishes in milliseconds and all tasks run in parallel.",
        np: "`runInBackground()` use गर्ने। Parallel मा spawn हुन्छ।",
        jp: "`runInBackground()` で並列実行。付けないと直列で動き、遅いタスクが後続を遅らせる。",
      },
    },
    {
      question: {
        en: "How do I test that a scheduled command fires at the right time?",
        np: "Scheduled command सही time मा fire हुन्छ भनेर कसरी test गर्ने?",
        jp: "スケジュールが正しい時刻に実行されるかテストするには？",
      },
      answer: {
        en: "Use Laravel's time-travel helpers to simulate a specific date/time, then inspect the schedule:\n\n`$this->travelTo(Carbon::parse('2025-01-06 08:00')); // a Monday at 8am`\n`$event = collect(app(Schedule::class)->events())->first(fn($e) => str_contains($e->command, 'emails:digest'));`\n`$this->assertTrue($event->isDue(app()));`\n\nAlso useful: `$event->getSummaryForDisplay()` returns the cron expression as a human-readable string.",
        np: "`travelTo()` + `Schedule::events()` use गरेर test गर्ने।",
        jp: "`travelTo()` で時刻を固定し `Schedule::events()` でスケジュールを検証する。",
      },
    },
  ],
};
