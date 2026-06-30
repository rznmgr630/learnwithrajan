import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 13 covers three tools for doing work <b>outside</b> the web request cycle.\n\n<b>Queues</b> — for tasks that are too slow for a web request (sending emails, resizing images, calling external APIs)\n  ↳ Hand the work off to a background worker so users get an instant response\n\n<b>Events & Listeners</b> — for notifying different parts of your app when something happens\n  ↳ Instead of calling services directly, you fire an event and let listeners react independently\n\n<b>Task Scheduling</b> — for running commands on a timer (daily reports, cleanup jobs)\n  ↳ One PHP file replaces a messy pile of cron job configs on the server",
      np: "Queue (slow task), Event/Listener (decoupled), Scheduling (cron)। तीन tool एउटै day।",
      jp: "Queue は重い処理を非同期化、Event/Listener は疎結合な通知、Scheduling は cron の代替。3 つのツールを習得。",
    },
  ],
  sections: [
    {
      title: {
        en: "Jobs & queue dispatching",
        np: "Job र queue dispatch",
        jp: "Job とキューディスパッチ",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-queue-job",
        },
        {
          type: "paragraph",
          text: {
            en: "Think of a queue like a restaurant ticket system — the waiter (your web request) takes the order and hands a ticket to the kitchen (the worker), then immediately goes back to take the next customer's order.\n\n<b>Why use queues?</b>\n• Some tasks are slow: sending emails, resizing images, calling external APIs\n  ↳ If you do these during a web request, the user waits 3–5 seconds staring at a spinner\n• With a queue, the web request finishes in milliseconds and hands the slow work to a background worker\n  ↳ The user gets a response immediately — the email sends a second later\n\n<b>How it works</b>\n• Create a <b>Job class</b> — a PHP class that implements `ShouldQueue` with a `handle()` method\n• <b>Dispatch</b> the job from your controller — Laravel serializes it and puts it on the queue\n• A separate <b>worker process</b> (`php artisan queue:work`) runs in the background, picks jobs off the queue, and calls `handle()`\n  ↳ The worker runs independently of your web server — you can scale them separately",
            np: "`ShouldQueue` implement गर्नु। Worker ले `handle()` call। HTTP fast।",
            jp: "`ShouldQueue` を実装したクラスがジョブ。ワーカーが `handle()` を実行。HTTP を速く保つ。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Queue driver comparison",
            np: "Queue driver तुलना",
            jp: "Queue ドライバー比較",
          },
          headers: [
            { en: "Driver", np: "Driver", jp: "ドライバー" },
            { en: "Best for", np: "प्रयोग", jp: "用途" },
            { en: "Requires", np: "आवश्यक", jp: "必要なもの" },
            { en: "Production-ready?", np: "Production?", jp: "本番対応？" },
          ],
          rows: [
            [
              { en: "`sync`", np: "`sync`", jp: "`sync`" },
              { en: "Local development / testing", np: "Dev/test", jp: "開発・テスト用" },
              { en: "Nothing", np: "केही होइन", jp: "不要" },
              { en: "No (runs inline)", np: "होइन", jp: "No（同期実行）" },
            ],
            [
              { en: "`database`", np: "`database`", jp: "`database`" },
              { en: "Small apps, low volume", np: "Small app", jp: "小規模アプリ" },
              { en: "`jobs` table migration", np: "`jobs` table", jp: "`jobs` テーブル" },
              { en: "Yes (limited throughput)", np: "हो (सीमित)", jp: "Yes（低スループット）" },
            ],
            [
              { en: "`redis`", np: "`redis`", jp: "`redis`" },
              { en: "High-volume production", np: "High volume", jp: "高負荷本番" },
              { en: "Redis server + predis/phpredis", np: "Redis", jp: "Redis サーバー" },
              { en: "Yes (recommended)", np: "हो (सिफारिश)", jp: "Yes（推奨）" },
            ],
            [
              { en: "`sqs`", np: "`sqs`", jp: "`sqs`" },
              { en: "AWS-hosted workloads", np: "AWS", jp: "AWS 環境" },
              { en: "AWS credentials + `aws/aws-sdk-php`", np: "AWS credentials", jp: "AWS 認証情報" },
              { en: "Yes (fully managed)", np: "हो (managed)", jp: "Yes（フルマネージド）" },
            ],
          ],
        },
        {
          type: "code",
          title: { en: "Creating a Job", np: "Job बनाउने", jp: "Job の作成" },
          code: `php artisan make:job SendWelcomeEmail`,
        },
        {
          type: "code",
          title: { en: "Job class anatomy", np: "Job class", jp: "Job クラスの構造" },
          code: `// app/Jobs/SendWelcomeEmail.php
namespace App\\Jobs;

use App\\Models\\User;
use App\\Mail\\WelcomeMail;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Number of times the job may be attempted. */
    public int $tries = 3;

    /** Timeout in seconds before the job is considered failed. */
    public int $timeout = 60;

    /** Number of seconds to wait before retrying. */
    public int $backoff = 30;

    public function __construct(
        public readonly User $user
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeMail($this->user));
    }
}`,
        },
        {
          type: "code",
          title: { en: "Dispatching jobs", np: "Job dispatch", jp: "Job のディスパッチ" },
          code: `use App\\Jobs\\SendWelcomeEmail;
use App\\Jobs\\GenerateThumbnail;
use App\\Jobs\\SendInvoice;
use Illuminate\\Support\\Facades\\Bus;

// Immediate dispatch
SendWelcomeEmail::dispatch($user);

// Delayed dispatch — run 5 minutes from now
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));

// Specific queue channel
SendWelcomeEmail::dispatch($user)->onQueue('emails');

// Dispatch to a specific connection + queue
SendWelcomeEmail::dispatch($user)
    ->onConnection('redis')
    ->onQueue('high');

// Chained jobs — run sequentially, stop on failure
Bus::chain([
    new GenerateThumbnail($post),
    new SendInvoice($order),
    new SendWelcomeEmail($user),
])->onQueue('default')->dispatch();

// Run queue worker
// php artisan queue:work --queue=high,emails,default
// php artisan queue:work redis --tries=3 --timeout=90`,
        },
      ],
    },
    {
      title: {
        en: "Failed jobs & retry strategy",
        np: "Failed job र retry",
        jp: "失敗したジョブとリトライ戦略",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Even reliable workers fail sometimes — the email service goes down, a network request times out, or bad data causes an exception.\n\n<b>What happens when a job fails</b>\n• If a job throws an exception, Laravel retries it up to `$tries` times (you set this on the job class)\n  ↳ Between retries it waits `$backoff` seconds — giving external services time to recover\n• After all retries are exhausted, the job is marked as <b>failed</b> and stored in the `failed_jobs` database table\n  ↳ Laravel records the exception message and stack trace so you can see exactly what went wrong\n• The `failed(Throwable $exception)` method on the job is called — use it to clean up partial work or send an alert\n\n<b>What you can do next</b>\n• `php artisan queue:failed` — list all failed jobs with their IDs and error messages\n• `php artisan queue:retry <id>` — push a specific failed job back onto the queue\n• `php artisan queue:flush` — delete all records from `failed_jobs`",
            np: "`$tries` पार भए `failed_jobs` table। `failed()` method clean up गर्न।",
            jp: "`$tries` を超えるか例外が起きると `failed_jobs` に記録。`failed()` でクリーンアップ。",
          },
        },
        {
          type: "code",
          title: { en: "failed() method + artisan commands", np: "failed() र artisan", jp: "failed() とコマンド" },
          code: `// Inside the job class
public function failed(\\Throwable $exception): void
{
    // Notify the user, clean up partial work, send alert
    $this->user->notify(new JobFailedNotification($exception->getMessage()));

    Log::error('SendWelcomeEmail failed', [
        'user_id' => $this->user->id,
        'error'   => $exception->getMessage(),
    ]);
}

// Manually fail from inside handle()
public function handle(): void
{
    if (! $this->user->isActive()) {
        $this->fail(new \\RuntimeException('User is not active'));
        return;
    }
    // ...
}

// Artisan commands for failed jobs
// php artisan queue:failed              — list all failed jobs
// php artisan queue:retry <id>          — retry one job by ID
// php artisan queue:retry all           — retry all failed jobs
// php artisan queue:forget <id>         — delete one failed job
// php artisan queue:flush               — delete ALL failed jobs
// php artisan queue:failed-table        — create failed_jobs migration`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Laravel Horizon</b> is a real-time dashboard for Redis queues — think of it as the control room for all your background workers.\n• Install it with `composer require laravel/horizon` then visit `/horizon` in your browser\n• It shows: how many jobs are waiting, how fast they're being processed, which ones failed, and how long each one took\n  ↳ Essential for production systems where you need to catch problems before users notice them",
            np: "Horizon — Redis queue dashboard। `/horizon` UI। Production मा essential।",
            jp: "Horizon は Redis キューのダッシュボード。スループット・失敗・深さをリアルタイム表示。",
          },
        },
      ],
    },
    {
      title: {
        en: "Events & Listeners",
        np: "Event र Listener",
        jp: "イベントとリスナー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine a package delivery system: when an order ships, you want to (1) email the customer, (2) update the inventory, and (3) log it for analytics.\n\n<b>The naive approach</b>\n• Call each service directly from your controller — works, but your controller now knows about email, inventory, AND analytics\n  ↳ When you add a fourth action, you have to touch the controller again\n\n<b>The Event / Listener approach</b>\n• Fire a single `OrderShipped` <b>event</b> from your controller — it just carries the order data\n• Three separate <b>Listeners</b> each subscribe to that event and handle their own piece\n  ↳ Your controller only knows it shipped an order — it doesn't care what happens next\n  ↳ Adding a fourth action means adding a fourth listener, not touching the controller\n• In Laravel 11, listeners are auto-discovered — no registration file needed",
            np: "Event = something happened। Listener = respond। Laravel 11 मा auto-discover।",
            jp: "Event は「何かが起きた」の通知、Listener が「対応する」。Laravel 11 は自動検出。",
          },
        },
        {
          type: "code",
          title: { en: "Generate Event & Listener", np: "Generate", jp: "生成コマンド" },
          code: `php artisan make:event OrderShipped
php artisan make:listener SendShipmentNotification --event=OrderShipped
php artisan make:listener UpdateInventory --event=OrderShipped`,
        },
        {
          type: "code",
          title: { en: "Event class", np: "Event class", jp: "Event クラス" },
          code: `// app/Events/OrderShipped.php
namespace App\\Events;

use App\\Models\\Order;
use Illuminate\\Foundation\\Events\\Dispatchable;
use Illuminate\\Queue\\SerializesModels;

class OrderShipped
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Order $order
    ) {}
}`,
        },
        {
          type: "code",
          title: { en: "Queueable Listener", np: "Queueable Listener", jp: "キュー対応リスナー" },
          code: `// app/Listeners/SendShipmentNotification.php
namespace App\\Listeners;

use App\\Events\\OrderShipped;
use App\\Notifications\\OrderShippedNotification;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Queue\\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'notifications';
    public int $delay = 10; // seconds

    public function handle(OrderShipped $event): void
    {
        $event->order->user->notify(
            new OrderShippedNotification($event->order)
        );
    }

    public function failed(OrderShipped $event, \\Throwable $exception): void
    {
        Log::error('Shipment notification failed', ['order' => $event->order->id]);
    }
}`,
        },
        {
          type: "code",
          title: { en: "Dispatching events", np: "Event dispatch", jp: "Event のディスパッチ" },
          code: `use App\\Events\\OrderShipped;

// Option 1: global helper
event(new OrderShipped($order));

// Option 2: static dispatch method (same result)
OrderShipped::dispatch($order);

// Option 3: fire-and-forget on Eloquent model event
// (define in boot() or as Model::observe())
Order::created(fn (Order $order) => OrderShipped::dispatch($order));

// Manual registration (Laravel 10 / if auto-discovery disabled)
// app/Providers/EventServiceProvider.php
protected $listen = [
    OrderShipped::class => [
        SendShipmentNotification::class,
        UpdateInventory::class,
    ],
];`,
        },
        {
          type: "paragraph",
          text: {
            en: "Sometimes you want to push an event to the browser in real time — for example, updating a live dashboard when a job finishes.\n• This is called <b>broadcasting</b> and uses a WebSocket server (Pusher, Ably, or a self-hosted Soketi)\n• The event implements `ShouldBroadcast`, and your frontend JavaScript subscribes using Laravel Echo\n  ↳ This is a more advanced topic — see the official Laravel Broadcasting docs when you're ready for it",
            np: "Broadcasting — Pusher/Soketi। Frontend subscribe गर्छ। Separate topic।",
            jp: "ブロードキャストは Pusher/Soketi でフロントエンドにリアルタイム通知。`ShouldBroadcast` を実装。",
          },
        },
      ],
    },
    {
      title: {
        en: "Task Scheduling",
        np: "Task Scheduling",
        jp: "タスクスケジューリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Cron jobs are powerful but painful to manage — each one is a separate line in a server config file, and you need server access to add or change them.\n\n<b>Laravel's scheduler solves this</b>\n• You add <b>one single cron entry</b> to the server that runs every minute: `* * * * * php artisan schedule:run`\n• Then you define every scheduled task in your PHP code — no more touching server config files\n  ↳ In Laravel 11 all schedules live in `routes/console.php`\n  ↳ In Laravel 10 they live in `app/Console/Kernel.php`\n• This means schedules are version-controlled, reviewable in pull requests, and testable locally\n  ↳ `php artisan schedule:work` polls every minute in your terminal so you can test without deploying",
            np: "One cron entry (every minute), baaki sab PHP maa। Laravel 11 मा `routes/console.php`।",
            jp: "1 分ごとの cron 1 エントリーで動く。Laravel 11 は `routes/console.php` にスケジュール定義。",
          },
        },
        {
          type: "code",
          title: { en: "Creating a scheduled command", np: "Command बनाउने", jp: "コマンドの作成" },
          code: `php artisan make:command SendWeeklyReport`,
        },
        {
          type: "code",
          title: { en: "Schedule definitions (Laravel 11 — routes/console.php)", np: "Schedule define", jp: "スケジュール定義" },
          code: `// routes/console.php (Laravel 11)
use Illuminate\\Support\\Facades\\Schedule;

// Artisan commands
Schedule::command('emails:send')->dailyAt('09:00');
Schedule::command('reports:weekly')->weekly()->mondays()->at('08:00');
Schedule::command('db:backup')->daily()->timezone('Asia/Kathmandu');
Schedule::command('queue:prune-failed', ['--hours=48'])->daily();

// Every N minutes
Schedule::command('app:sync-inventory')->everyFiveMinutes();
Schedule::command('app:poll-webhooks')->everyMinute();

// Closures (for quick one-off tasks)
Schedule::call(function () {
    DB::table('sessions')->where('last_activity', '<', now()->subHours(2))->delete();
})->hourly();

// Overlap prevention — skip if previous run still executing
Schedule::command('app:process-images')
    ->everyMinute()
    ->withoutOverlapping();

// Run in background (don't block the scheduler process)
Schedule::command('app:heavy-report')
    ->daily()
    ->runInBackground()
    ->onSuccess(function () { Log::info('Report done'); })
    ->onFailure(function () { Log::error('Report failed'); });

// Send output to a log file
Schedule::command('inspire')
    ->hourly()
    ->appendOutputTo(storage_path('logs/inspire.log'));`,
        },
        {
          type: "code",
          title: { en: "Single server cron entry (add to server crontab)", np: "Server cron", jp: "サーバーの cron エントリー" },
          code: `# Run this ONE entry on your server — Laravel handles the rest
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1

# For local development
php artisan schedule:work    # polls every minute in foreground

# Test a specific scheduled task immediately
php artisan schedule:run

# List all scheduled tasks
php artisan schedule:list`,
        },
        {
          type: "paragraph",
          text: {
            en: "When you run multiple servers (a cluster), every server runs the scheduler every minute — by default, the same scheduled task runs on every server simultaneously.\n• Add `->onOneServer()` to prevent this — only the first server to claim the job actually runs it\n  ↳ It uses a shared Redis cache as a locking mechanism to coordinate across servers\n  ↳ Requires `CACHE_STORE=redis` in `.env` so all servers see the same lock",
            np: "Cluster मा एक मात्र server मा run: `->onOneServer()`। Shared cache चाहिन्छ।",
            jp: "クラスター環境で 1 台だけ実行したい場合は `->onOneServer()`。共有キャッシュが必要。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Queues vs Events?",
        np: "Queue र Event कहिले प्रयोग गर्ने?",
        jp: "Queue と Event はどう使い分けますか？",
      },
      answer: {
        en: "Think of it this way:\n\n<b>Use a Queue when</b>\n• You have a single slow task (sending an email, calling an external API, generating a PDF)\n• The task doesn't need to happen before the user gets a response\n  ↳ The user clicks 'Register' → your code creates the account → then a queued job sends the welcome email separately\n\n<b>Use Events when</b>\n• Multiple unrelated parts of your app need to react when something happens\n• You want those reactions to stay decoupled from the code that triggered them\n  ↳ An order ships → email the customer AND update inventory AND log analytics — three listeners, all independent\n\nThey're not mutually exclusive — a listener can also implement `ShouldQueue` to run its logic in the background too.",
        np: "Queue = slow deferred task। Event = decoupled reaction। Listener लाई ShouldQueue थप्न सकिन्छ।",
        jp: "Queue は遅い単発タスクの非同期化、Event は複数の疎結合な反応。Listener に `ShouldQueue` を付ければ両立できます。",
      },
    },
    {
      question: {
        en: "How do I monitor queue workers in production?",
        np: "Production मा queue worker monitor?",
        jp: "本番でキューワーカーを監視する方法は？",
      },
      answer: {
        en: "For <b>Redis queues</b>: install <b>Laravel Horizon</b> — it gives you a live web dashboard at `/horizon` showing job throughput, failures, and queue depth. Horizon also integrates with Supervisor (a Linux process manager) to keep your workers running automatically.\n\nFor <b>non-Redis queues</b>: use Supervisor directly with a config that keeps `php artisan queue:work --tries=3` running as a service.\n\nWhenever you deploy new code, run `php artisan horizon:terminate` (or restart the queue:work process) so workers pick up the latest code — stale workers run old code indefinitely otherwise.",
        np: "Horizon — Redis dashboard। Supervisor — process manager। Deploy मा `horizon:terminate`।",
        jp: "Redis なら Horizon が最適。Supervisor でワーカープロセスを管理。デプロイ後は `horizon:terminate`。",
      },
    },
    {
      question: {
        en: "What happens if a job fails all retries?",
        np: "Job सबै retry fail भए के हुन्छ?",
        jp: "全リトライが失敗したらどうなりますか？",
      },
      answer: {
        en: "When all retries are exhausted, the job lands in the `failed_jobs` database table along with the full exception and stack trace.\n\n<b>What you can do</b>\n• `php artisan queue:failed` — list all failed jobs with their IDs and error messages\n• `php artisan queue:retry <id>` — push a specific job back onto the queue\n• `php artisan queue:retry all` — retry every failed job at once\n• `php artisan queue:flush` — delete all records from `failed_jobs`\n\nTip: define a `failed(Throwable $exception)` method on your job class and use it to send a Slack alert or undo partial work (like rolling back a payment attempt).",
        np: "`failed_jobs` table मा जान्छ। `failed()` call। `queue:retry` ले retry।",
        jp: "`failed_jobs` テーブルに移動し `failed()` が呼ばれる。`queue:retry` で再試行可能。",
      },
    },
    {
      question: {
        en: "How do I test queued jobs?",
        np: "Queued job test कसरी?",
        jp: "キュージョブをテストする方法は？",
      },
      answer: {
        en: "You don't want tests to actually send emails or hit external services — use `Queue::fake()` to intercept jobs without running them.\n\n• Call `Queue::fake()` at the top of your test\n• Run the code that should dispatch a job\n• Assert the job was (or wasn't) pushed:\n  ↳ `Queue::assertPushed(SendWelcomeEmail::class)` — confirms the job was dispatched\n  ↳ `Queue::assertPushedOn('emails', SendWelcomeEmail::class)` — confirms it was sent to the right queue\n  ↳ `Queue::assertNotPushed(SomeOtherJob::class)` — confirms a job was NOT dispatched\n\nTo test the job's logic itself, just call `(new SendWelcomeEmail($user))->handle()` directly — no queue or worker needed.",
        np: "`Queue::fake()` — job push assert। `handle()` direct call test।",
        jp: "`Queue::fake()` でキューを偽装し `assertPushed()` で確認。`handle()` の単体テストは直接呼び出す。",
      },
    },
    {
      question: {
        en: "Can I dispatch an event inside a job?",
        np: "Job भित्र event dispatch गर्न मिल्छ?",
        jp: "Job の中でイベントをディスパッチできますか？",
      },
      answer: {
        en: "Yes — calling `event(new SomeEvent($data))` or `SomeEvent::dispatch($data)` inside a job's `handle()` method works fine.\n\nOne thing to watch: if that event has queueable listeners, those listeners are queued separately and fail independently.\n  ↳ A failing listener won't automatically roll back or fail the parent job\n  ↳ If you need strict ordering (do A, then B, then C — stop if any fail), use `Bus::chain()` instead of events",
        np: "`handle()` भित्र `event()` call गर्न मिल्छ। Listener failure parent job rollback गर्दैन।",
        jp: "`handle()` 内で `event()` を呼べます。リスナー失敗は親ジョブをロールバックしません。順序が必要なら `Bus::chain()` を使用。",
      },
    },
    {
      question: {
        en: "How does `->withoutOverlapping()` work?",
        np: "`withoutOverlapping()` कसरी काम गर्छ?",
        jp: "`->withoutOverlapping()` の仕組みは？",
      },
      answer: {
        en: "Before running a scheduled task, `->withoutOverlapping()` tries to claim an atomic lock in your cache.\n• If the lock is free, the task runs and holds the lock until it's done\n• If the lock is already claimed (the previous run is still going), this invocation is skipped entirely\n  ↳ The lock expires after 24 hours by default so a crashed job doesn't block things forever\n\n<b>When to use it</b>\n• Any long-running command that runs more frequently than it takes to finish\n  ↳ Example: a 90-second image processing command scheduled every minute would normally stack up — `->withoutOverlapping()` prevents this\n\nRequires a cache driver that supports atomic locks: Redis, Memcached, or `database`.",
        np: "Cache lock acquire। Previous run चलिरहेको छ भने skip। Redis/DB cache चाहिन्छ।",
        jp: "アトミックキャッシュロックを取得。前の実行が残っていればスキップ。Redis か DB キャッシュが必要。",
      },
    },
    {
      question: {
        en: "How do I handle tasks that must run only on one server in a cluster?",
        np: "Cluster मा एक server मा मात्र run?",
        jp: "クラスターで 1 台だけ実行する方法は？",
      },
      answer: {
        en: "Without `->onOneServer()`, every server in your cluster runs every scheduled task independently — you'd send the daily report email three times if you have three servers.\n\n• Chain `->onOneServer()` to any scheduled task\n  ↳ All servers race to claim a shared cache lock when the scheduler fires\n  ↳ Only the winner runs the task — the others see the lock is taken and skip\n• Example: `Schedule::command('reports:generate')->daily()->onOneServer()`\n• Requires a shared Redis cache (`CACHE_STORE=redis` in `.env`) so all servers see the same lock",
        np: "`->onOneServer()` — shared cache lock। पहिलो server मात्र run।",
        jp: "`->onOneServer()` で共有キャッシュロックを使い 1 台だけ実行。Redis の共有キャッシュが必要。",
      },
    },
  ],
};
